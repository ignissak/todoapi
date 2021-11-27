import { HookContext } from "@feathersjs/feathers";
import { App } from "../app";
import { User } from "../model/user.model";
import { Res } from "../utils/response";

export async function findUser(context: HookContext) {
    const { data } = context;
    let result: HookContext = context;

    const email = data.email;
    const username = data.username;

    const repository = App.getConnection().getRepository(User);

    await repository.createQueryBuilder()
        .where("username = :username OR email = :email", {
            'username': username,
            'email': email
        }).getOne().then(x => {
            if (typeof x !== "undefined") {
                if (x.email == email && x.username == username) {
                    result.data = Res.forbiddenWithText("Email and username is already used.");
                } else if (x.username == username) {
                    result.data = Res.forbiddenWithText("Username is already used.");
                } else if (x.email == email) {
                    result.data = Res.forbiddenWithText("Email is already used.");
                }
            }
        })

    return result;
}