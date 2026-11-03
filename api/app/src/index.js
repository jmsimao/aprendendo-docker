import express from "express";
import mysql from "mysql2";

const app = express();

const port = 9001;

const conn = mysql.createConnection({
    host : "172.17.0.2"
    ,port : 3306
    ,user : "root"
    ,password : "root"
});

console.log(conn.stream['connecting'])



app.listen(port, (err) => {
    if (! err) {
        console.log('Servidor no ar! Porta %d!', port);
    }
});

app.get("/", (req, res, err) => {
    res.send('Olá, você está na raiz do docker introdução!');
});
