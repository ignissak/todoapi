import { Params } from "@feathersjs/feathers";
import { App } from "../app";

export namespace Utils {

    export function validateEmail(email: string): boolean {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    /* export function verifyToken(app: App, params: Params): boolean {
        console.log(params);
        if (params.headers == undefined) return false;

        const bearerHeader = params.headers['authorization'];

        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];

            app.express.service('authentication').verifyAccessToken(bearerToken).then(() => {
                return true;
            }).catch(() => {
                return false;
            });
        } else {
            return false;
        }
        return false;
    } */
}