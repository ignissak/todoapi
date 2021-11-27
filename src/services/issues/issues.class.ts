import { Application } from "@feathersjs/express";
import { Params } from "@feathersjs/feathers";
import { Service } from "feathers-memory";

export class Issues extends Service {

    private app: Application;
    
    constructor(app: Application) {
        super();

        this.app = app;
    }

    async find(params: Params): Promise<any> {
        
    }
}