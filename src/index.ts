import { createConnection } from "typeorm";
import { App } from "./app";
import * as _ from '../config/default.json';
import * as _1 from '../ormconfig.json';

createConnection().then(connection => {
    console.log("Connected to database, starting server...");
    new App(connection);
}).catch(e => {
    console.error(e);
    process.exit(1);
})