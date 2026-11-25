import mySQL_db from "../../db/mysql_db.js";
import redis_db from "../../db/redis_db.js";
import { redisKey } from "../../shared/utils/function.js";
import mensagem from "../../shared/utils/mensagem.js";
import "dotenv/config";

async function getProduto(req, res, next) {
    var status = 200; var data = {};
    const _env = process.env;
    const sql = "select * from products p order by p.name;";

    const connMySQL = await mySQL_db();
    const connRedis = await redis_db();

    connMySQL.connect((err) => {
        if (err == null) {
            connMySQL.query(sql, (errq, result, fields) => {
                if (! errq) {
                    data = result.map(tuple => ({
                        codret: 1
                        ,id: tuple.id
                        ,produto: tuple.name
                        ,valor: tuple.price
                        ,ativo: true
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

async function getProdutoCache(req, res, next) {
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

export { getProduto, getProdutoCache };