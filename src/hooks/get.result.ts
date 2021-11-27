import { HookContext } from "@feathersjs/feathers";

export function getResult() {
	return async (context: HookContext) => {
		console.log(context.result);
		return context;
	}
}