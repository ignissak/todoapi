import { findUser } from '../../hooks/find.user';
import { isLogged } from '../../hooks/islogged';

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
		all: [],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	},

	error: {
		all: [],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	}
};
