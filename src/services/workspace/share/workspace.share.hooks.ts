import { isLogged } from "../../../hooks/islogged";

export default {
    before: {
        create: [ isLogged ],
        update: [ isLogged ],
        remove: [ isLogged ]
    }
}