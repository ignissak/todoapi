import { Application } from "@feathersjs/express";
import { Params } from "@feathersjs/feathers";
import { Service } from "feathers-memory";
import { App } from "../../app";
import { User } from "../../model/user.model";
import { Res } from "../../utils/response";

const bcrypt = require('bcrypt');

export class Users extends Service {

    private app: Application;

    constructor(app: Application) {
        super();

        this.app = app;
    }

    async find(params: Params): Promise<any> {
        if (!params.authenticated) {
            return Res.forbiddenWithText("Token is missing/invalid.");
        }
        const users = await App.getConnection().getRepository(User).find();
        return Res.success(users);
    }

    async create(data: any, params: Params): Promise<any> {
        // Request failed in before-hook
        if (Object.prototype.toString.call(data) === "[object Promise]") { // Is promise
            return data;
        }

        const email = data.email
        const username = data.username
        let password = data.password 

        if (!email || !username || !password) {
            return Res.property_required("Email, username and password have to be defined.");
        }

        password = await bcrypt.hash(password, 10);

        const repository = App.getConnection().getRepository(User);
        const user = new User();

        user.email = email;
        user.username = username;
        user.password = password;
        user.issues = [];
        user.workspaces = [];

        await repository.save(user);

        return Res.success({'id': user.id, 'email': email, 'username': username});
    }

}