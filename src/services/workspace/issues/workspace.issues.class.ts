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
     * GET /workspaces/{id}/issues
     * 
     * @returns Workspace's issues
     */
    async find(params: Params): Promise<any> {
        console.log(params);
        if (!params.route) {
            return Res.not_found();
        }

        const workspaceId = params.route.workspaceId
        if (isNaN(+workspaceId)) {
            return Res.bad_request("ID has not be a number.");
        }
        const id = parseInt(workspaceId);

        const workspaceRepository = App.getConnection().getRepository(Workspace)
        const workspace = await workspaceRepository.findOne({ 'id': id });

        if (!workspace) {
            return Res.not_found();
        }

        return Res.success(workspace.issues);
    }
}