import express from "express";
import mysql from "mysql2";

const app = express();

const port = 9001;

// npm start local : localhost
// sem o parâmetro: --link: 172.17.0.1
const conn = mysql.createConnection({
    host : "mysql-container-01"
    ,database : "mydb"
    ,port : 3306
    ,user : "root"
    ,password : "root"
});

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
            res.status(200).send(result.map(item => ({ id : item.id, produto : item.name, valor : item.price, ativo : "sim"})));
        }
        else {
            res.status(500).json({ id : err.code, code: err.code, message : err.message, url : req.url});
        };
    });
});