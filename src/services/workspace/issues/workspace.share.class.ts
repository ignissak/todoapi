import { Application } from "@feathersjs/feathers";
import { Service } from "feathers-memory";

export default class WorkspaceShareClass extends Service {

    private app: Application;

    constructor(app: Application) {
        super();

        this.app = app;
    }
    
    /**
     * PUT /workspaces/{id}/share
     */
}