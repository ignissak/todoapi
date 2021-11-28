import { Application } from "@feathersjs/express";
import { ServiceAddons } from "@feathersjs/feathers";
import { Workspaces } from "./workspace.class";
import workspaceHooks from "./workspace.hooks";
import WorkspaceIssuesClass from "./issues/workspace.issues.class";
import WorkspaceShareClass from "./share/workspace.share.class";
import workspaceShareHooks from "./share/workspace.share.hooks";

declare module '../../declarations' {
    interface ServiceTypes {
        'workspaces': Workspaces & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    app.use('/workspaces', new Workspaces(app));
    app.use('/workspaces/:workspaceId/issues', new WorkspaceIssuesClass(app));

    app.use('/workspaces/:workspaceId/share', new WorkspaceShareClass(app));
    app.service('/workspaces/:workspaceId/share').hooks(workspaceShareHooks);

    app.service('workspaces').hooks(workspaceHooks);
}