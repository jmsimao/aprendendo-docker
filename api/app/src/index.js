import express from "express";
import routes from "./route/routes.js";
import "dotenv/config";

const app = express();
const _env = process.env;

app.use(express.json());

const serverPort = process.env.SERVER_PORT;

app.listen(serverPort, (error) => {
    if (! error) {
        routes(app);
        console.log(`\n${_env.SERVER_MENS_OK}\nPorta ${serverPort}.\n`);
    } else {
        console.error(`\n${_env.SERVER_MENS_ERRO}\nmensagem: ${error}.\n`)
    };
});

//eof