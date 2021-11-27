import { Response } from 'express';

export namespace Res {

	export function not_found() {
		return Promise.resolve({
			status: 404,
			success: false,
			error: 'Not found!',
			data: []
		});
	}

	export function forbidden() {
		return Promise.resolve({
			status: 403,
			success: false,
			error: 'Forbidden.',
			data: []
		})
	}

	export function forbiddenWithText(property: string) {
		return Promise.resolve({
			status: 403,
			success: false,
			error: property,
			data: []
		})
	}

	export function body_missing(res: Response) {
		return Promise.resolve({
			status: 500,
			success: false,
			error: 'Request Body is missing.',
			data: []
		});
	}

	export function success(object: Object) {
		return Promise.resolve({
			status: 200,
			success: true,
			data: object
		})
	}

	export function property_required(property: String) {
		return Promise.resolve({
			status: 400,
			success: false,
			error: 'Property ' + property + ' is required.',
			data: []
		})
	}

	export function bad_request(message: string) {
		return Promise.resolve({
			status: 400,
			success: false,
			error: message,
			data: []
		});
	}

	export function error(err: Error) {
		return Promise.resolve({
			status: 500,
			success: false,
			error: err.message,
			data: []
		});
	}

	export function errorWithText(err: string) {
		return Promise.resolve({
			status: 500,
			success: false,
			error: err,
			data: []
		});
	}
}
