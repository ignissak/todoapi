import { HookContext } from "@feathersjs/feathers";
import { Res } from "../utils/response";

export async function sendError(context: HookContext) {
    if (context.type != 'error') return context;

    context.data = Res.error(context.error)
    return context;
}