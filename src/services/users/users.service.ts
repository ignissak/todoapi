import { Users } from "./users.class";
import usersHooks from "./users.hooks";
import { Application } from '../../declarations'
import { ServiceAddons } from "@feathersjs/feathers";

declare module '../../declarations' {
    interface ServiceTypes {
      'users': Users & ServiceAddons<any>;
    }
  }

export default function (app: Application): void {
    app.use('/users', new Users(app));

    app.service('users').hooks(usersHooks);
}