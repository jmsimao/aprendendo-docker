import express from "express";
import redis, { createClient, RedisClient } from "redis";
import routes from "./route/routes.js";

const app = express();

app.use(express.json());

const serverPort = 9001;

app.listen(serverPort, (error) => {
    if (! error) {
        routes(app);
        console.log(`Webserver back-end (node) no ar!\nPorta em uso ${serverPort}.\n`);
    } else {
        console.error(`Erro no servidor:\n${error.message}.`)
    };
});

//eof