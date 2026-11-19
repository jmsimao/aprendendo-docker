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

await connRedis.connect();
if (! connRedis.isOpen) {
    console.error("\nBD Redis não iniciado!");
} else {
    console.log("\nBD Redis no ar!");
};
const redisExpiration = 900;


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
    const sql = "select * from person where id = ?"
 
    const chave = req.url.substring(1).replace('/','_');
    console.log('Redis key: ' + chave);

    const dataRedis = await connRedis.get(chave)
    if (dataRedis) {
        console.log('Get data from REDIS!');
        return res.status(status).json(JSON.parse(dataRedis));
    } else {
        console.log('Get data from MYSQL!');
        connMySQL.connect((err) => {
            if (err == null) {
                connMySQL.query(sql, [id], async (err1, result, fields) => {
                    if (! err1) {
                        if (result.length == 0) {
                            status = 404; ret = { coderet: 0
                                                ,message : "Registro não localizado!"};
                        } else { 
                            ret = result.map(tuple => (
                                {
                                coderet: 1
                                ,id: tuple.id
                                ,nome: tuple.name
                                ,email: tuple.email
                                ,fone: tuple.phone
                                ,companhia: tuple.company
                                ,cidade: tuple.city
                                ,registro: tuple.registered
                            }));
                            // Gravar em Redis.
                            await connRedis.set(chave, JSON.stringify(ret), { EX: redisExpiration });        
                        };
                    return res.status(status).json(ret);
                    } else {
                        status = 500; ret = { coderet: -1
                                             ,errno: err1.errno
                                             ,code: err1.code
                                             ,message: err1.message
                                            };
                    };
                    return res.status(status).json(ret);
                });
            } else {
                status = 500; ret = { coderet: -2
                                    ,message: mensagem.erroConexao
                                    ,errno: err.errno
                                    ,code: err.code
                                    ,message2: err.message
                                    };
                return res.status(status).json(ret);
            };
        });
    };

});
