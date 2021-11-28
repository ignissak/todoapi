import { HookContext } from "@feathersjs/feathers";
import { App } from "../app";
import { User } from "../model/user.model";
import { Res } from "../utils/response";
import * as jwt from 'jsonwebtoken';

const config = require('config');
const bcrypt = require('bcrypt');

export async function login(context: HookContext) {
    const { data } = context;
    let result: HookContext = context;

    let email = data.email;
    let password = data.password;

    if (!email || !password) {
        result.data = Res.bad_request("Email or password is missing.");
        return result;    
    }

    let exists = await existsByEmail(email);
    if (!exists) {
        result.data = Res.unauthorizedWithtext("Account with this email does not exist.");
        return result;
    }

    let encryptedPassword = await fetchPassword(email);

    if (encryptedPassword === null || encryptedPassword === undefined) {
        result.data = Res.errorWithText("Unknown error while logging in.");
        return result;
    }

    const validPassword = await bcrypt.compare(password, encryptedPassword);

    if (!validPassword) {
        result.data = Res.unauthorizedWithtext("Invalid password.");
        return result;
    }

    const token = jwt.sign({'email': email}, config.get("authentication.secret"), {expiresIn: '6h', algorithm: config.get("authentication.jwtOptions.algorithm")});
    
    result.data = Res.success({'token': token});

    return result;
}

async function existsByEmail(email: string): Promise<boolean> {
    return new Promise(async (resolve: any, reject: any) => {
        App.getConnection().getRepository(User).findOne({'email': email}).then(result => {
            if (typeof result !== "undefined") {
                resolve(true);
            }
            resolve(false);
        }).catch(error => {
            console.error(error);
            reject(error);
        })
    })
}

async function fetchPassword(email: string): Promise<string> {
    return new Promise(async (resolve: any, reject: any) => {
        App.getConnection().getRepository(User).findOne({'email': email}).then(result => {
            if (typeof result !== "undefined") {
                resolve(result.password);
            }
            reject();
        }).catch(error => {
            console.error(error);
            reject(error);
        })
    })
}