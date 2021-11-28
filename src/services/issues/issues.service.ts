import { Application } from '../../declarations'
import { ServiceAddons } from "@feathersjs/feathers";
import issuesHooks from './issues.hooks';
import { Issues } from './issues.class';

declare module '../../declarations' {
	interface ServiceTypes {
		'api/issues': Issues & ServiceAddons<any>;
	}
}

export default function (app: Application): void {
	app.use('api/issues', new Issues(app));

	app.service('api/issues').hooks(issuesHooks);
}