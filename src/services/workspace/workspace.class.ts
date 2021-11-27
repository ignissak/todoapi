import { Application, Id, NullableId, Params } from "@feathersjs/feathers";
import { Service } from "feathers-memory";
import { isNumberObject } from "util/types";
import { App } from "../../app";
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
     * GET /workspaces/{id}
     * 
     * @returns Workspace searched by desired ID
     */
    async get(id: Id, params: Params) {
        if (isNaN(+id)) {
            return Res.bad_request("ID has not be a number.");
        }
        id = <number>id;

        const workspaceRepository = App.getConnection().getRepository(Workspace)
        const workspace = await workspaceRepository.findOne({ 'id': id });

        if (!workspace) {
            return Res.not_found();
        }

        return Res.success(workspace);
    }

    /**
     * GET /workspaces
     * @returns User's available workspaces
     */
    async find(params: Params): Promise<any> {
        if (!params.authenticated) {
            return Res.forbiddenWithText("Token is missing/invalid.");
        }

        const email = params.email;
        const user = await App.getConnection().getRepository(User).findOne({ 'email': email });

        if (!user) {
            return Res.errorWithText("Could not retrieve user."); // How could this happen, lol?
        }

        return Res.success(user.workspaces);
    }

    /**
     * POST /workspaces
     * Required body: name (string)
     * 
     * Creates workspace for user with desired name.
     * @returns Object with workspace's ID and name.
     */
    async create(data: any, params: Params): Promise<any> {
        if (!params.authenticated) {
            return Res.forbiddenWithText("Token is missing/invalid.");
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
            return Res.forbiddenWithText("Token is missing/invalid.");
        }

        if (id === null) {
            return Res.bad_request("ID cannot be null.");
        }

        if (isNaN(+id)) {
            return Res.bad_request("ID has not be a number.");
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

}