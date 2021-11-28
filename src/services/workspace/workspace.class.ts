import { Application, Id, NullableId, Params } from "@feathersjs/feathers";
import { response } from "express";
import { Service } from "feathers-memory";
import { isNumberObject } from "util/types";
import { App } from "../../app";
import { Issue } from "../../model/issue.model";
import { User } from "../../model/user.model";
import { Workspace } from "../../model/workspace.model";
import { Res } from "../../utils/response";

export class Workspaces extends Service {

    private app: Application;

    constructor(app: Application) {
        super();

        this.app = app;
    }

    /**
     * GET /workspaces
     * @returns User's available workspaces
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

        const response: any = [];

        user.workspaces.forEach(w => {
            response.push({'id': w.id, 'name': w.name})
        })

        return Res.success(response);
    }

    /**
     * GET /workspaces/{id}
     * 
     * @returns Workspace searched by desired ID
     */
     async get(id: Id, params: Params) {
        if (isNaN(+id)) {
            return Res.bad_request("ID must be a number.");
        }
        id = <number>id;

        const workspaceRepository = App.getConnection().getRepository(Workspace)
        const workspace = await workspaceRepository.findOne({ 'id': id });

        if (!workspace) {
            return Res.not_found();
        }

        return Res.success({'id': workspace.id, 'name': workspace.name});
    }

    /**
     * POST /workspaces
     * Required body: name (string)
     * 
     * Creates workspace for user with desired name.
     * @returns Created workspace
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

        const name = data.name;

        if (!name) {
            return Res.property_required("name");
        }

        const userRepository = App.getConnection().getRepository(User)
        const workspaceRepository = App.getConnection().getRepository(Workspace)

        const workspace = new Workspace();

        workspace.name = name;
        workspace.issues = [];
        workspace.users = Promise.resolve([]);
        (await workspace.users).push(user);

        if (typeof user.workspaces === "undefined") {
            user.workspaces = [];
        }
        user.workspaces.push(workspace);

        await workspaceRepository.save(workspace);
        await userRepository.save(user);

        // Avoiding converting circular structure to JSON
        return Res.success({ id: workspace.id, name: workspace.name });
    }


    /**
     * PUT /workspaces/{id}
     * Required body: id (number)
     * 
     * Updates workspace's name.
     * 
     * @returns Object with workspace's ID, old and new name.
     */
    async update(id: NullableId, data: any, params: Params) {
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
     
        const newName = data.newName;

        if (!id || !newName) {
            return Res.property_required("newName");
        }

        const workspaceRepository = App.getConnection().getRepository(Workspace)
        const workspace = await workspaceRepository.findOne({ 'id': id })

        if (!workspace) {
            return Res.not_found();
        }

        // Checking if user is part of this workspace, 
        // and whether he can rename this workspace.
        const workspaceUsers = await workspace.users;

        if (!workspaceUsers.some(u => u.id === user.id)) {
            return Res.forbidden();
        }

        const oldName = workspace.name;
        workspace.name = newName;

        workspaceRepository.save(workspace);

        return Res.success({ id: workspace.id, 'oldName': oldName, 'newName': newName });
    }

    /**
     * DELETE workspaces/{id}
     * 
     * Removes whole workspace and it's issues.
     */
    async remove(id: NullableId, params: Params) {
        if (!params.authenticated) {
            return Res.unauthorized();
        }

        let workspaceId: Id | null = id
        if (workspaceId === null) {
            return Res.not_found();
        }

        if (isNaN(+workspaceId)) {
            return Res.bad_request("ID must be a number.");
        }
        workspaceId = <number>workspaceId;

        const email = params.email;
        const user = await App.getConnection().getRepository(User).findOne({ 'email': email });

        if (!user) {
            return Res.errorWithText("Could not retrieve user."); // How could this happen, lol?
        }

        const workspaceRepository = App.getConnection().getRepository(Workspace);
        const workspace = await workspaceRepository.findOne({id: workspaceId});

        if (!workspace) {
            return Res.not_found();
        }

        // Checking if user is part of this workspace.
        let workspaceUsers = await workspace.users;

        if (!workspaceUsers.some(u => u.id === user.id)) {
            return Res.forbidden();
        }

        const issuesRepository = App.getConnection().getRepository(Issue);
        await issuesRepository.remove(workspace.issues);

        await workspaceRepository.remove(workspace);

        return Res.success([]);
    }

}