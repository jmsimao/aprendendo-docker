import express from "express";
import mysql from "mysql2";

const app = express();

const port = 9001;

const conn = mysql.createConnection({
    host : "localhost"
    ,port : 3306
    ,user : "root"
    ,password : "root"
    ,database : "mydb"
});

console.log(conn)

app.listen(port, (err) => {
    if (! err) {
        console.log('Servidor no ar! Porta %d!', port);
    }
});

app.get("/", (req, res, err) => {
    res.status(200).send('Olá, você está na raiz do docker introdução!');
});

app.get("/products", (req, res, error) => {
    conn.query("select * from products order by name", (err, result, fields) => {
        if (! err) {
            res.status(200).send(result);
        } else {
            console.log(err);
            res.status(500).send(err);
        };
    })
}
);
