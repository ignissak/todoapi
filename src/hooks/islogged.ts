import { HookContext } from "@feathersjs/feathers";
import * as jwt from 'jsonwebtoken';

const config = require('config');

/**
 * Checks if there is correct and valid token in request header.
 * If not, user is not authenticated.
 */
export async function isLogged(context: HookContext) {
    if (!context.params.headers) {
        context.params.authenticated = false
        return context;
    }


    let token = context.params.headers['x-access-token'] || context.params.headers['authorization']; // Express headers are auto converted to lowercase
    if (token === undefined) {
        context.params.authenticated = false
        return context;
    }


    if (typeof token !== "string" || token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    if (token) {
        if (typeof token === "string") {
            jwt.verify(token, config.get("authentication.secret"), (err: any, decoded: any | string) => {
                if (err) {
                    context.params.authenticated = false
                    return context;
                } else {
                    context.params.authenticated = true
                }

                context.params.email = decoded.email;

                return context;
            })
        }
    }
    return context;
}