import * as local from '@feathersjs/authentication-local';
import { findUser } from '../../hooks/find.user';
import { isLogged } from '../../hooks/islogged';
import { sendError } from '../../hooks/send.error';

const { protect } = local.hooks;

export default {
	before: {
		all: [],
		find: [ isLogged ],
		get: [],
		create: [ findUser ], // Check if this user isn't already created
		update: [],
		patch: [],
		remove: []
	},

	after: {
		all: [
			// Make sure the password field is never sent to the client
			// Always must be the last hook
			protect('data.password'),
			protect('password')
		],
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
