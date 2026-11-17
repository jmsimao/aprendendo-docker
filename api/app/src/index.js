import express, { json } from "express";
import mysql from "mysql2";
import redis, { createClient, RedisClient } from "redis";
import mensagem from "./module/mensagem.js"

const app = express();

const port = 9001;
//const mysqlHostname = "mysql-container"
//const redisHostname = "redis-container"
const mysqlHostname = "localhost"
const redisHostname = "localhost"

// npm start local : localhost
// sem o parâmetro: --link: 172.17.0.1
// host : "mysql-container-01"
const connMySQL = mysql.createConnection({
    host : mysqlHostname
    ,database : "mydb"
    ,port : 3306
    ,user : "root"
    ,password : "root"
});

const connRedis = redis.createClient({
    url : "redis://" + redisHostname + ":6379"
});

connRedis.connect();
if (! connRedis.isOpen) {
    console.error("\nBD Redis não iniciado!");
} else {
    console.log("\nBD Redis no ar!");
};


app.listen(port, (error) => {
    if (! error) {
        console.log('Webserver back-end (node) no ar! Porta %d.\n', port);
    } else {
        console.error('Erro no servidor: %s', error)
    };
});


// Routes
app.get("/", (req, res) => {
    res.status(200).send('Aprendendo Docker, com MySQL, NodeJS e Apache !');
});

app.get("/produto", (req, res, next) => {
    var status = 200; var ret = {};
    const sql = "select * from products order by name;";

    connMySQL.connect((err) => {
        if (! err == null) {
            status = 500; res.status(status).send(mensagem.erroConexao);
        } else {
            connMySQL.query(sql, (err, result, fields) => {
                if (! err) {
                    ret = result.map(item => (
                        {
                        id: item.id
                        ,produto: item.name
                        ,valor: item.price
                        ,ativo: "sim"
                        }));
                } else {
                    status = 404; ret = { "id": err.errno, "code": err.code, "message": err.message, "url": req.url };
                };
                return res.status(status).json(ret);
            });
        };
    });
});

app.get("/pessoa", (req, res, next) => {
    var status = 200; var ret = {}
    const sql = "select * from person order by name;"
    
    connMySQL.connect((err) => {
        if (! err == null) {
            status = 500; res.status(status).send(mensagem.erroConexao);
        } else { 
            connMySQL.query(sql, (err, result, fields) => {
                if (! err) {
                    //console.log(fields);
                    ret = result.map(item => (
                        {
                        id: item.id, 
                        nome : item.name 
                        ,email: item.email 
                        ,fone: item.phone
                        ,companhia: item.company
                        ,cidade: item.city
                        ,registro: item.registered 
                        }));
                } else {
                    status = 404; ret = { "id": err.errno, "code": err.code, "message": err.message, "url": req.url };
                };
                return res.status(status).json(ret);
            });
        };
    });
});

app.get("/pessoa/:id", async (req, res, next) => {
    const id = req.params.id;
    var status = 200; var ret = {}
    const sql = "select * from person where id = ? order by name;"
    
    const chave = "pessoa_" + id; 
    console.log(chave);
    const dataRedis = await connRedis.get(chave);
    console.log(dataRedis)
    if (dataRedis) {
        console.log('Lendo do Redis')
        status = 200; ret = (dataRedis);
        return res.status(200).json(JSON.stringify(ret));
    } else {
        connMySQL.connect((err) => {
            if (! err == null) {
                status = 500; res.status(status).send(mensagem.erroConexao);
            } else {
                console.log('mysql')
                connMySQL.query(sql, [id], (err, result, fields) => {
                    if (! err) {
                        // console.log(fields);
                        ret = result.map(item => (
                            {
                            id: item.id, 
                            nome : item.name 
                            ,email: item.email 
                            ,fone: item.phone
                            ,companhia: item.company
                            ,cidade: item.city
                            ,registro: item.registered 
                            }));

                        if (ret.length == 0) {
                            status = 404; ret = { "id": parseInt(id), nome : "Não localizado!"};
                        };
                        console.log('Pessoa' + ret);
                        connRedis.set(chave, ret);
                    } else {
                        status = 404; ret = { "id": err.errno, "code": err.code, "message": err.message, "url": req.url };
                    };
                    return res.status(status).json(ret);
                });
            };
        });
    };
});
