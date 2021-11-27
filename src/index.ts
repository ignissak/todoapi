import { createConnection } from "typeorm";
import { App } from "./app";

createConnection().then(connection => {
    console.log("Connected to database, starting server...");
    new App(connection);
}).catch(e => {
    console.error(e);
    process.exit(1);
})