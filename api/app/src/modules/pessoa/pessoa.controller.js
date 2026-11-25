import mySQL_db from "../../db/mysql_db.js";
import redis_db from "../../db/redis_db.js";
import mensagem from "../../shared/utils/mensagem.js";

async function getPessoa(req, res, next) {
    var status = 200; var data = {};
    const sql = "select * from person p order by p.name;";

    const connMySQL = await mySQL_db();
    const connRedis = await redis_db();

    connMySQL.connect((err) => {
        //console.log(err);
        if (err == null) {
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
                    console.log("get data from db...");

                    const chaveRedis = req.url.toString().substring(1).replace('/','_');
                    // console.log(chaveRedis);
                    connRedis.set(chaveRedis, JSON.stringify(data), { EX : 300 });
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
    var status = 200; const chave = req.url.toString().substring(1).replace('/','_');
 
    const connRedis = await redis_db();
    const data = await connRedis.get(chave);
    if (data) {
        console.log('get data from cache...')
        return res.status(status).json(JSON.parse(data));
    } else {
        return next();
    };
};

async function getPessoaId(req, res, next) {
    var status = 200; var data = {};
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

                        const chaveRedis = req.url.toString().substring(1).replace('/','_');
                        //console.log(chaveRedis);
                        connRedis.set(chaveRedis, JSON.stringify(data), { EX : 300 });
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
    var status = 200; const chave = req.url.toString().substring(1).replace('/','_');
 
    const connRedis = await redis_db();
    const data = await connRedis.get(chave);
    if (data) {
        console.log('get data from cache...')
        return res.status(status).json(JSON.parse(data));
    } else {
        return next();
    };
};

export { getPessoa, getPessoaCache, getPessoaId, getPessoaIdCache };
// eof