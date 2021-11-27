import { Application } from "@feathersjs/express";
import { ServiceAddons } from "@feathersjs/feathers";
import { Workspaces } from "./workspace.class";
import workspaceHooks from "./workspace.hooks";
import WorkspaceIssuesClass from "./issues/workspace.issues.class";

declare module '../../declarations' {
    interface ServiceTypes {
        'workspaces': Workspaces & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    app.use('/workspaces', new Workspaces(app));
    app.use('/workspaces/issues', new WorkspaceIssuesClass(app));

    app.service('workspaces').hooks(workspaceHooks);
}