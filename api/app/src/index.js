import express from "express";
import mysql from "mysql2";
import redis, { createClient, RedisClient } from "redis";

const app = express();

const port = 9001;
const mysqlHostname = "mysql-container"
const redisHostname = "redis-container"

// npm start local : localhost
// sem o parâmetro: --link: 172.17.0.1
// host : "mysql-container-01"
const conn = mysql.createConnection({
    host : mysqlHostname
    ,database : "mydb"
    ,port : 3306
    ,user : "root"
    ,password : "root"
});

const redisConn = redis.createClient({
    url : "redis://" + redisHostname + ":6379"
});

await redisConn.connect()
if (! redisConn.isOpen) {
    console.error("\nBD Redis não iniciado!");
} else {
    console.log("\nBD Redis no ar!");
}

conn.connect()

app.listen(port, (error) => {
    if (! error) {
        console.log('Webserver back-end (node) no ar! Porta %d.\n', port);
    } else {
        console.error('Erro no servidor: %s', error)
    };
});

app.get("/", (req, res) => {
    res.status(200).send('Aprendendo Docker, com MySQL, NodeJS e Apache !');
});

app.get("/product", (req, res) => {
    const sql = "select * from products order by id";
    conn.query(sql, (err, result, fields) => {
        if (! err) {
            console.log(req.url);
            res.status(200).send(result.map(item => ({ id : item.id, produto : item.name, valor : item.price, ativo : "sim"})));
        }
        else {
            res.status(500).json({ id : err.code, code: err.code, message : err.message, url : req.url});
        };
    });
});

app.get("/person", (req, res) => {
    const sql = "select * from person order by name";
    conn.query(sql, (error, result, fields) => {
        if (! error) {
            console.log(req.url);
            res.status(200).json(result.map(item => ({ id: item.id, nome : item.name, email: item.email, fone: item.phone, companhia: item.company, cidade: item.city, registro: item.registered})));
        } else
        {
            res.status(500).send(error.message);
        };
    });
});