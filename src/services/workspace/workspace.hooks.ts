import { isLogged } from "../../hooks/islogged";

export default {
    before: {
		all: [],
		find: [ isLogged ],
		get: [ isLogged ],
		create: [ isLogged ], 
		update: [ isLogged ],
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
}