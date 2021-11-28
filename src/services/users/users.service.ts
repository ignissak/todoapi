import { Users } from "./users.class";
import usersHooks from "./users.hooks";
import { Application } from '../../declarations'
import { ServiceAddons } from "@feathersjs/feathers";

declare module '../../declarations' {
    interface ServiceTypes {
      'api/users': Users & ServiceAddons<any>;
    }
  }

export default function (app: Application): void {
    app.use('api/users', new Users(app));

    app.service('api/users').hooks(usersHooks);
}