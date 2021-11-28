import { Application, Id, NullableId, Params } from "@feathersjs/feathers";
import { Service } from "feathers-memory";
import { App } from "../../../app";
import { User } from "../../../model/user.model";
import { Workspace } from "../../../model/workspace.model";
import { Res } from "../../../utils/response";

export default class WorkspaceShareClass extends Service {

    private app: Application;

    constructor(app: Application) {
        super();

        this.app = app;
    }

    /**
     * POST /workspaces/{workspaceId}/share/{userId}
     * 
     * Shares a workspace with desired user.
     */

    async update(id: NullableId, data: any, params: Params): Promise<any> {
        if (!params.authenticated) {
            return Res.unauthorized();
        }

        if (!params.route) {
            return Res.not_found();
        }

        let workspaceId: string | number = params.route.workspaceId
        if (isNaN(+workspaceId)) {
            return Res.bad_request("ID must be a number.");
        }
        workspaceId = parseInt(workspaceId);

        let userId: Id | null = id
        if (userId === null) {
            return Res.not_found();
        }

        if (isNaN(+userId)) {
            return Res.bad_request("UserId must be a number.");
        }
        userId = <number>userId;

        const email = params.email;
        const user = await App.getConnection().getRepository(User).findOne({ 'email': email });

        if (!user) {
            return Res.errorWithText("Could not retrieve user."); // How could this happen, lol?
        }

        const userRepository = App.getConnection().getRepository(User)
        const workspaceRepository = App.getConnection().getRepository(Workspace)

        const workspace = await workspaceRepository.findOne({ id: workspaceId });

        if (!workspace) {
            return Res.not_found();
        }

        const targetUser = await userRepository.findOne({ id: userId })

        if (!targetUser) {
            return Res.not_found();
        }

        // Checking if user is part of this workspace.
        const workspaceUsers = await workspace.users;

        if (!workspaceUsers.some(u => u.id === user.id)) {
            return Res.forbidden();
        }

        (await workspace.users).push(targetUser);
        targetUser.workspaces.push(workspace);

        await workspaceRepository.save(workspace);
        await userRepository.save(targetUser);

        return Res.success(
            {
                'user': {
                    'id': targetUser.id,
                    'username': targetUser.username,
                    'email': targetUser.username
                },
                'workspace': {
                    'id': workspace.id,
                    'name': workspace.name
                }
            });
    }

    /**
     * DELETE /workspaces/{workspaceId}/share/{userId}
     * 
     * Removes user from desired workspace.
     */
    async remove(id: NullableId, params: Params): Promise<any> {
        if (!params.authenticated) {
            return Res.unauthorized();
        }

        if (!params.route) {
            return Res.not_found();
        }

        let workspaceId: string | number = params.route.workspaceId
        if (isNaN(+workspaceId)) {
            return Res.bad_request("ID must be a number.");
        }
        workspaceId = parseInt(workspaceId);

        let userId: Id | null = id
        if (userId === null) {
            return Res.not_found();
        }

        if (isNaN(+userId)) {
            return Res.bad_request("UserId must be a number.");
        }
        userId = <number>userId;

        const email = params.email;
        const user = await App.getConnection().getRepository(User).findOne({ 'email': email });

        if (!user) {
            return Res.errorWithText("Could not retrieve user."); // How could this happen, lol?
        }

        const userRepository = App.getConnection().getRepository(User)
        const workspaceRepository = App.getConnection().getRepository(Workspace)

        const workspace = await workspaceRepository.findOne({ id: workspaceId });

        if (!workspace) {
            return Res.not_found();
        }

        const targetUser = await userRepository.findOne({ id: userId })

        if (!targetUser) {
            return Res.not_found();
        }

        // Checking if user is part of this workspace.
        let workspaceUsers = await workspace.users;

        if (!workspaceUsers.some(u => u.id === user.id)) {
            return Res.forbidden();
        }

        // Remove user from workspace & remove workspace from user
        targetUser.workspaces = targetUser.workspaces.filter(x => x.id !== workspace.id);
        workspaceUsers = workspaceUsers.filter(x => x.id !== targetUser.id);

        await workspaceRepository.save(workspace);
        await userRepository.save(targetUser);

        return Res.success(
            {
                'user': {
                    'id': targetUser.id,
                    'username': targetUser.username,
                    'email': targetUser.username
                },
                'workspace': {
                    'id': workspace.id,
                    'name': workspace.name
                }
            });
    }
}