import { Application } from "@feathersjs/express";
import { Params } from "@feathersjs/feathers";
import { Service } from "feathers-memory";

export class Login extends Service {

    private app: Application;

    constructor(app: Application) {
        super();

        this.app = app;
    }

    async create(data: any, params: Params) {
        return data;
    }
}