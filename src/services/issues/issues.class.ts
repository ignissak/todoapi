import { Application } from "@feathersjs/express";
import { Id, NullableId, Params } from "@feathersjs/feathers";
import { Service } from "feathers-memory";
import { copyFile } from "fs";
import { App } from "../../app";
import { IssueState } from "../../model/enums/issue.state";
import { Issue } from "../../model/issue.model";
import { User } from "../../model/user.model";
import { Workspace } from "../../model/workspace.model";
import { Res } from "../../utils/response";

export class Issues extends Service {

    private app: Application;

    constructor(app: Application) {
        super();

        this.app = app;
    }

    /**
     * GET /issues
     * 
     * @returns Issues whose author is user
     */
    async find(params: Params): Promise<any> {
        if (!params.authenticated) {
            return Res.unauthorized();
        }

        const email = params.email;
        const user = await App.getConnection().getRepository(User).findOne({ 'email': email });

        if (!user) {
            return Res.errorWithText("Could not retrieve user."); // How could this happen, lol?
        }

        return Res.success(user.issues);
    }

    /**
     * GET /issues/{id}
     * 
     * @returns Issue searched by desired ID
     */
    async get(id: Id, params: Params): Promise<any> {
        if (isNaN(+id)) {
            return Res.bad_request("ID must be a number.");
        }
        id = <number>id;

        const issuesRepository = App.getConnection().getRepository(Issue);
        const issue = await issuesRepository.findOne({ 'id': id });

        if (!issue) {
            return Res.not_found();
        }

        const author = await issue.author;
        const workspace = await issue.workspace;

        return Res.success({
            id: issue.id,
            title: issue.title,
            text: issue.text,
            deadline: issue.deadline,
            state: issue.state,
            author: {
                id: author.id,
                username: author.username,
                email: author.email
            },
            workspace: {
                id: workspace.id,
                name: workspace.name
            }
        });
    }

    /**
     * POST /issues
     * Required body: workspaceId (string), title (string), text (string)
     * Optional body: deadline (iso date)
     * 
     * @returns Created issue
     */
    async create(data: any, params: Params): Promise<any> {
        if (!params.authenticated) {
            return Res.unauthorized();
        }

        const email = params.email;
        const user = await App.getConnection().getRepository(User).findOne({ 'email': email });

        if (!user) {
            return Res.errorWithText("Could not retrieve user."); // How could this happen, lol?
        }

        const workspaceId = data.workspaceId;
        const title = data.title;
        let text = data.text;
        let deadline = data.deadline;

        if (!workspaceId || !title) {
            return Res.property_required("worskspaceId", "title");
        }

        // Optional text
        if (!text) {
            text = "";
        }

        // Parsing optional deadline
        // Default: current Date()
        if (!deadline) {
            deadline = new Date();
        } else {
            deadline = Date.parse(deadline);
        }

        const workspaceRepository = App.getConnection().getRepository(Workspace);
        const workspace = await workspaceRepository.findOne({ 'id': workspaceId });

        if (!workspace) {
            return Res.not_found();
        }

        // Checking if user is part of this workspace.
        const workspaceUsers = await workspace.users;

        if (!workspaceUsers.some(u => u.id === user.id)) {
            return Res.forbidden();
        }

        const userRepository = App.getConnection().getRepository(User);
        const issuesRepository = App.getConnection().getRepository(Issue);

        const issue = new Issue();

        issue.title = title;
        issue.text = text;
        issue.deadline = deadline;
        issue.author = Promise.resolve(user);
        issue.workspace = Promise.resolve(workspace);

        workspace.issues.push(issue);
        user.issues.push(issue);

        await issuesRepository.save(issue);
        await workspaceRepository.save(workspace);
        await userRepository.save(user);

        return Res.success(
            {
                id: issue.id,
                title: issue.title,
                text: issue.text,
                deadline: issue.deadline,
                state: issue.state,
                author: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                },
                workspace: {
                    id: workspace.id,
                    name: workspace.name
                }
            });
    }

    /**
     * PUT /issues/{id}
     * Optional body: newWorkspaceId (string), newTitle (string), newText (string), newDeadline (iso date), newState (IssueState)
     * 
     * Updates issue's properties.
     */
    async update(id: NullableId, data: any, params: Params): Promise<any> {
        if (!params.authenticated) {
            return Res.unauthorized();
        }

        if (id === null) {
            return Res.bad_request("ID cannot be null.");
        }

        if (isNaN(+id)) {
            return Res.bad_request("ID must be a number.");
        }
        id = <number>id;

        const email = params.email;
        const user = await App.getConnection().getRepository(User).findOne({ 'email': email });

        if (!user) {
            return Res.errorWithText("Could not retrieve user."); // How could this happen, lol?
        }

        const issuesRepository = App.getConnection().getRepository(Issue);
        const issue = await issuesRepository.findOne({ 'id': id })

        if (!issue) {
            return Res.not_found();
        }

        const oldIssue = Object.assign(Object.create(Object.getPrototypeOf(issue)), issue)

        let newWorkspaceId = data.newWorkspaceId;

        // Change workspace
        if (newWorkspaceId) {
            if (isNaN(+newWorkspaceId)) {
                return Res.bad_request("ID must be a number.");
            }
            newWorkspaceId = <number>newWorkspaceId;
            
            const workspaceRepository = App.getConnection().getRepository(Workspace)
            const workspace = await workspaceRepository.findOne({ 'id': newWorkspaceId })

            if (!workspace) {
                return Res.bad_request("Invalid workspace ID.");
            }

            // Checking if user is part of this workspace.
            const workspaceUsers = await workspace.users;

            if (!workspaceUsers.some(u => u.id === user.id)) {
                return Res.forbidden();
            }

            const oldWorkspace = await issue.workspace;

            // Filter out issue in old workspace
            //oldWorkspace.issues = oldWorkspace.issues.filter(item => item.id !== issue.id);

            issue.workspace = Promise.resolve(workspace);
            workspace.issues.push(issue);

            workspaceRepository.save(await issue.workspace);
            workspaceRepository.save(workspace);
        }

        const newTitle = data.newTitle;
        if (newTitle) {
            issue.title = newTitle;
        }

        const newText = data.newText;
        if (newText) {
            issue.text = newText;
        }

        const newDeadline = data.newDeadline;
        if (newDeadline) {
            issue.deadline = new Date(Date.parse(newDeadline));
        }

        const newState = data.newState;
        if (newState) {
            issue.state = IssueState[newState as keyof typeof IssueState]
        }

        issuesRepository.save(issue);

        return Res.success({
            'id': issue.id,
            'oldIssue': {
                'workspace': {
                    'id': (await oldIssue.workspace).id,
                    'name': (await oldIssue.workspace).name
                },
                'title': oldIssue.title,
                'text': oldIssue.text,
                'deadline': oldIssue.deadline,
                'state': oldIssue.state
            },
            'newIssue': {
                'workspace': {
                    'id': (await issue.workspace).id,
                    'name': (await issue.workspace).name
                },
                'title': issue.title,
                'text': issue.text,
                'deadline': issue.deadline,
                'state': issue.state
            }
        })
    }

    /**
     * DELELE /issues/{id}
     * 
     * Deletes issue by ID.
     */
    async remove(id: NullableId, params: Params): Promise<any> {
        if (!params.authenticated) {
            return Res.unauthorized();
        }

        let issueId: Id | null = id
        if (issueId === null) {
            return Res.not_found();
        }

        if (isNaN(+issueId)) {
            return Res.bad_request("ID must be a number.");
        }
        issueId = <number>issueId;

        const email = params.email;
        const user = await App.getConnection().getRepository(User).findOne({ 'email': email });

        if (!user) {
            return Res.errorWithText("Could not retrieve user."); // How could this happen, lol?
        }

        const issuesRepository = App.getConnection().getRepository(Issue);
        const issue = await issuesRepository.findOne({ id: issueId })

        if (!issue) {
            return Res.not_found();
        }

        const issueWorkspace = await issue.workspace;

        // Checking if user is part of this workspace,
        // or author of the issue.
        let workspaceUsers = await issueWorkspace.users;

        if (!workspaceUsers.some(u => u.id === user.id) && (await issue.author).id !== user.id) {
            return Res.forbidden();
        }

        await issuesRepository.remove(issue);

        return Res.success([]);
    }
}