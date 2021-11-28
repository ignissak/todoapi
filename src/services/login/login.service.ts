
import { Application } from '../../declarations'
import { ServiceAddons } from "@feathersjs/feathers";
import { Login } from './login.class';
import loginHooks from './login.hooks';

declare module '../../declarations' {
	interface ServiceTypes {
		'api/login': Login & ServiceAddons<any>;
	}
}

export default function (app: Application): void {
	app.use('api/login', new Login(app));

	app.service('api/login').hooks(loginHooks);
}