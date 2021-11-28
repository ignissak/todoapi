import { Application } from "../declarations";
import indexService from "./index/index.service";
import issuesService from "./issues/issues.service";
import loginService from "./login/login.service";
import usersService from "./users/users.service";
import workspaceService from "./workspace/workspace.service";

export default function (app: Application): void {
    app.configure(usersService);
    app.configure(loginService);
    app.configure(workspaceService);
    app.configure(issuesService);
    app.configure(indexService);
}