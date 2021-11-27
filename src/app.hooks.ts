import { sendError } from "./hooks/send.error";
import * as local from '@feathersjs/authentication-local';

const { protect } = local.hooks;

export default {
    before: {
      all: [],
      find: [],
      get: [],
      create: [],
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
  