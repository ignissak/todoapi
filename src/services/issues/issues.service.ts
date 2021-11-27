import { Application } from '../../declarations'
import { ServiceAddons } from "@feathersjs/feathers";
import issuesHooks from './issues.hooks';
import { Issues } from './issues.class';

declare module '../../declarations' {
	interface ServiceTypes {
		'issues': Issues & ServiceAddons<any>;
	}
}

export default function (app: Application): void {
	app.use('/issues', new Issues(app));

	app.service('issues').hooks(issuesHooks);
}