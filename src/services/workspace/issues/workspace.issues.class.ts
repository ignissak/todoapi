import { Application, Id, Params } from "@feathersjs/feathers";
import { Service } from "feathers-memory";
import { App } from "../../../app";
import { Workspace } from "../../../model/workspace.model";
import { Res } from "../../../utils/response";

export default class WorkspaceIssuesClass extends Service {
    private app: Application;

    constructor(app: Application) {
        super();

        this.app = app;
    }

    /**
     * GET /workspaces/issues/{id}
     * 
     * @returns Workspace's issues
     */
    async get(id: Id, params: Params): Promise<any> {
        if (isNaN(+id)) {
            return Res.bad_request("ID has not be a number.");
        }
        id = <number>id;

        const workspaceRepository = App.getConnection().getRepository(Workspace)
        const workspace = await workspaceRepository.findOne({ 'id': id });

        if (!workspace) {
            return Res.not_found();
        }

        return Res.success(workspace.issues);
    }
}