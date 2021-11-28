import { Application } from '../../declarations'
import { HookContext, ServiceAddons } from "@feathersjs/feathers";
import { IndexClass } from './index.class';
import { disallow } from 'feathers-hooks-common';

declare module '../../declarations' {
    interface ServiceTypes {
        'api': IndexClass & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    app.use('api', new IndexClass());

    app.service('api').hooks({
        before: {
            all: [],
            find: [],
            get: [disallow()],
            create: [disallow()],
            update: [disallow()],
            patch: [disallow()],
            remove: [disallow()]
        }
    })
}