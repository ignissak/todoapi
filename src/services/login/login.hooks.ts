import { login } from "../../hooks/login";
import { sendError } from "../../hooks/send.error";

export default {
	before: {
		all: [],
		find: [],
		get: [],
		create: [ login ], // Check if this user isn't already created
		update: [],
		patch: [],
		remove: []
	},

	after: {
		all: [],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	},

	error: {
		all: [ sendError ],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	}
};