import { Application } from "../declarations";
import loginService from "./login/login.service";
import usersService from "./users/users.service";

export default function (app: Application): void {
    app.configure(usersService);
    app.configure(loginService);
}