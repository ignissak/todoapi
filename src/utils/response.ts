import { Response } from 'express';

export namespace Res {

	export function not_found() {
		return Promise.resolve({
			status: 404,
			success: false,
			error: 'Not found.',
			result: []
		});
	}

	export function forbidden() {
		return Promise.resolve({
			status: 403,
			success: false,
			error: 'Forbidden.',
			result: []
		})
	}

	export function forbiddenWithText(property: string) {
		return Promise.resolve({
			status: 403,
			success: false,
			error: property,
			result: []
		})
	}

	export function body_missing(res: Response) {
		return Promise.resolve({
			status: 500,
			success: false,
			error: 'Request Body is missing.',
			result: []
		});
	}

	export async function success(object: Object) {
		return Promise.resolve({
			status: 200,
			success: true,
			result: object
		})
	}

	export function property_required(...properties: string[]) {
		return Promise.resolve({
			status: 400,
			success: false,
			error: 'Properties ' + properties.join(", ") + ' are required.',
			result: []
		})
	}

	export function bad_request(message: string) {
		return Promise.resolve({
			status: 400,
			success: false,
			error: message,
			result: []
		});
	}

	export function error(err: Error) {
		return Promise.resolve({
			status: 500,
			success: false,
			error: err.message,
			result: []
		});
	}

	export function errorWithText(err: string) {
		return Promise.resolve({
			status: 500,
			success: false,
			error: err,
			result: []
		});
	}

	export function unauthorized() {
		return Promise.resolve({
			status: 401,
			success: false,
			error: 'Unauthorized.',
			result: []
		})
	}

	export function unauthorizedWithtext(message: string) {
		return Promise.resolve({
			status: 401,
			success: false,
			error: message,
			result: []
		})
	}
}
