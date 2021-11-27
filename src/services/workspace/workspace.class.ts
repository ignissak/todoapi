import { Application, Params } from "@feathersjs/feathers";
import { Service } from "feathers-memory";
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
     * @returns User's available workspaces
     */
    async find(params: Params): Promise<any> {
        if (!params.authenticated) {
            return Res.forbiddenWithText("Token is missing/invalid.");
        }

        const email = params.email;
        const user = await App.getConnection().getRepository(User).findOne({'email': email});

        if (!user) {
            return Res.errorWithText("Could not retrieve user."); // How could this happen, lol?
        }

        return Res.success(user.workspaces);
    }

    /**
     * POST /workspaces
     * Required parameter: name (string)
     * 
     * Creates workspace for user with desired name.
     * @returns Returns object with workspace's ID and name.
     */
    async create(data: any, params: Params): Promise<any> {
        if (!params.authenticated) {
            return Res.forbiddenWithText("Token is missing/invalid.");
        }

        const email = params.email;
        const user = await App.getConnection().getRepository(User).findOne({'email': email});

        if (!user) {
            return Res.errorWithText("Could not retrieve user."); // How could this happen, lol?
        }

        const name = data.name;

        if (!name) {
            return Res.bad_request("Name of workspace is missing.");
        }

        const userRepository = App.getConnection().getRepository(User)
        const workspaceRepository = App.getConnection().getRepository(Workspace)

        const workspace = new Workspace();

        workspace.name = name;
        workspace.issues = [];
        workspace.users = [];
        workspace.users.push(user);

        user.workspaces.push(workspace);

        await workspaceRepository.save(workspace);
        await userRepository.save(user);

        // Avoiding converting circular structure to JSON
        return Res.success({id: workspace.id, name: workspace.name}); 
    }

}