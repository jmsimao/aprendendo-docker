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
            connMySQL.query(sql, async (errq, result, fields) => {
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
                    await connRedis.set(key, JSON.stringify(data), { EX : _env.REDIS_EXPIRE })
                        .then((onfulfilled) => {
                            console.log(`Save to redis key: ${key}, cache return: ${onfulfilled}.\n`);
                        })
                        .catch((onrejected) => {
                            console.error(`Error redis key: ${key}, Rejected: ${onrejected}.\n`);
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
    console.time('inCache');
    const data = await connRedis.get(redisKey(req.url));
    console.timeEnd('inCache');
    if (data) {
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
            connMySQL.query(sql, [id], async (errq, result, fields) => {
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
                        await connRedis.set(key, JSON.stringify(data), { EX : _env.REDIS_EXPIRE })
                        .then((onfulfilled) => {
                            console.log(`Save to redis key: ${key}, cache return: ${onfulfilled}.\n`);
                        })
                        .catch((onrejected) => {
                            console.error(`Error redis key: ${key}, Rejected: ${onrejected}.\n`);
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

async function postPessoa(req, res, next) {
    var status = 200; var data = {};
    const _env = process.env;

    const connMySQL = await mySQL_db();
    const dml = "insert into person(name, email, phone, company, city, registered) values (?,?,?,?,?,?)";

    connMySQL.connect(async (err) => {
        if (err == null)  {
            const { name, email, phone, company, city, registered } = req.body;
         
            connMySQL.query(dml, [ name, email, phone, company, city, registered ], 
                async (errq, result, fields) => {
                    if (! errq) {
                        data = { codret: 1, insertId: result.insertId, affectedRows: result.affectedRows, url: req.url, method: req.method };
                        console.log(data);

                        const connRedis = await redis_db();
                        const key = redisKey(req.url + '_' + result.insertId.toString());
                        await connRedis.set(key, JSON.stringify(req.body), { EX : _env.REDIS_EXPIRE})
                            .then((onfulfilled) => {
                                console.log(`Save to redis key: ${key}, cache return: ${onfulfilled}.\n`);
                            })
                            .catch((onrejected) => {
                                console.error(`Error redis key: ${key}, Rejected: ${onrejected}.\n`);
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

async function deletePessoaId(req, res, next) {
    var status = 200; var data = {};
    const sql = "select p.id, p.name from person p where p.id = ?";
    const dml = "delete from person p where p.id = ?";

    const { id } = req.params;

    const connMySQL = await mySQL_db();
    connMySQL.connect(async (err) => {
        if (err == null) {
            connMySQL.query(sql, [ id ], (errq, result, fields) => {
                if (! errq) {
                    if (result.length > 0) {
                        data = result.map((tuple => ({ id: tuple.id, nome: tuple.name})));

                        connMySQL.query(dml, [ id ], (errd, result) => {
                            if (! errd) {



                                console.log('Registro eliminado!');
                                console.log(result);
                                data = result;
                            } else {
                                console.log(errd)
                                status = 500; data = { 
                                                codret: -1
                                                ,mensagem: errd.message
                                                ,code: errd.code
                                                ,errno: errd.errno
                                                ,name: errd.name
                                                ,sqlState: errd.sqlState
                                            };
                            };
                        });
                    } else {
                        status = 404; data = { 
                                        codret: 0
                                        ,mensagem: "Registro não localizado!"
                                        ,id: id 
                                        ,errno: 404
                                        ,name: "Not found"
                                        };
                    };
                    return res.status(status).json(data);
                } else {
                    status = 500; data = { 
                                        codret: -1
                                        ,mensagem: errq.message
                                        ,code: errq.code
                                        ,errno: errq.errno
                                        ,name: errq.name
                                        ,sqlState: errq.sqlState
                                    };
                    return res.status(status).json(data);            
                };
            });
        } else {
            status = 500; data = { codret: -2, mensagem: mensagem.erroConexao };
            console.log(data);
            return res.status(status).json(data);
        };
    });
};

export { getPessoa, getPessoaCache, getPessoaId, getPessoaIdCache, postPessoa, deletePessoaId };
// eof