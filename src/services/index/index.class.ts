import { Params } from "@feathersjs/feathers";
import { Service } from "feathers-memory";

export class IndexClass extends Service {

    async find(params: Params): Promise<any> {
        return Promise.resolve({
            'apiDocs': 'https://igniss.gitbook.io/todoapi-documentation/'
        })
    }
}