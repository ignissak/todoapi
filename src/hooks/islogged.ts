import { HookContext } from "@feathersjs/feathers";
import { NextFunction } from "express";
import { Res } from "../utils/response";
import * as jwt from 'jsonwebtoken';

const config = require('config');

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
                } else {
                    context.params.authenticated = true
                }

                return context;
            })
        }
    }
    return context;
}