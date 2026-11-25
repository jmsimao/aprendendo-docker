import mySQL_db from "../../db/mysql_db.js";
import redis_db from "../../db/redis_db.js";
import { redisKey } from "../../shared/utils/function.js";
import mensagem from "../../shared/utils/mensagem.js";
import "dotenv/config";

async function getPessoa(req, res, next) {
    var status = 200; var data = {};
    const _env = process.env;
    const sql = "select * from person p order by p.name;";

    const connMySQL = await mySQL_db();
    const connRedis = await redis_db();
    
    connMySQL.connect((err) => {
        //console.log(err);
        if (err == null) {
            console.time('nocache');
            connMySQL.query(sql, (errq, result, fields) => {
                if (! errq) {
                    data = result.map(tuple => ({
                         codret: 1
                        ,id: tuple.id
                        ,nome: tuple.name
                        ,email: tuple.email
                        ,fone: tuple.phone
                        ,companhia: tuple.company
                        ,cidade: tuple.city
                        ,registro: tuple.registered
                    }));
                    console.timeEnd('nocache');
                    console.log("get data from db...");
                    
                    const key = redisKey(req.url);
                    connRedis.set(key, JSON.stringify(data), { EX : _env.REDIS_EXPIRE })
                        .then((onfulfilled) => {
                            console.log(`Redis key: ${key}, cache return: ${onfulfilled}.\n`);
                        })
                        .catch((onrejected) => {
                            console.error(`Redis key: ${key}, Rejected: ${onrejected}.\n`);
                        });
                } else {
                    status = 500; data = { 
                                        codret: -1
                                        ,mensagem: errq.message
                                        ,code: errq.code
                                        ,errno: errq.errno
                                        ,name: errq.name
                                        ,sqlState: errq.sqlState
                                    };
                };
                return res.status(status).json(data);
            });
        } else {
            status = 500; data = { codret: -2, mensagem: mensagem.erroConexao };
            console.log(data);
            return res.status(status).json(data);
        };
    });
};

async function getPessoaCache(req, res, next) {
    var status = 200
    
    const connRedis = await redis_db();
    console.time('cache');
    const data = await connRedis.get(redisKey(req.url));
    if (data) {
        console.timeEnd('cache');
        console.log('get data from cache...\n')
        return res.status(status).json(JSON.parse(data));
    } else {
        return next();
    };
};

async function getPessoaId(req, res, next) {
    var status = 200; var data = {};
    const _env = process.env;
    const sql = "select * from person p where p.id = ?;"

    const { id } = req.params;

    const connMySQL = await mySQL_db();
    const connRedis = await redis_db();
    
    connMySQL.connect((err) => {
        if (err == null) {
            connMySQL.query(sql, [id], (errq, result, fields) => {
                if (! errq) {
                    if (result.length !== 0) {
                        data = result.map(tuple => ({
                            codret: 1
                            ,id: tuple.id
                            ,nome: tuple.name
                            ,email: tuple.email
                            ,fone: tuple.phone
                            ,companhia: tuple.company
                            ,cidade: tuple.city
                            ,registro: tuple.registered
                        }));
                        console.log("get data from db...");

                        const key = redisKey(req.url);
                        connRedis.set(key, JSON.stringify(data), { EX : _env.REDIS_EXPIRE })
                        .then((onfulfilled) => {
                            console.log(`Redis key: ${key}, cache return: ${onfulfilled}.\n`);
                        })
                        .catch((onrejected) => {
                            console.error(`Redis key: ${key}, Rejected: ${onrejected}.\n`);
                        });
                    } else {
                        status = 404; data = { codret: 0, mensagem: "Registro não encontrado!" };
                    };
                } else {
                    status = 500; data = { 
                                        codret: -1
                                        ,mensagem: errq.message
                                        ,code: errq.code
                                        ,errno: errq.errno
                                        ,name: errq.name
                                        ,sqlState: errq.sqlState
                                    };
                };
                return res.status(status).json(data);
            });
        } else {
            status = 500; data = { codret: -2, mensagem: mensagem.erroConexao };
            console.log(data);
            return res.status(status).json(data);
        };
    });
};

async function getPessoaIdCache(req, res, next) {
    var status = 200
    
    const connRedis = await redis_db();
    const data = await connRedis.get(redisKey(req.url));
    if (data) {
        console.log('get data from cache...\n')
        return res.status(status).json(JSON.parse(data));
    } else {
        return next();
    };
};

export { getPessoa, getPessoaCache, getPessoaId, getPessoaIdCache };
// eof