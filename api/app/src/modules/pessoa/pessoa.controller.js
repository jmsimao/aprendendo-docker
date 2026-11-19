import mensagem from "../../shared/utils/mensagem.js";

async function getPessoa(req, res, next, connMySQL, connRedis) {
    var status = 200; var ret = {};
    const sql = "select * from person order by name;";

    await connMySQL.connect((err) => {
        //console.log(err);
        if (err == null) {
            connMySQL.query(sql, (errq, result, fields) => {
                if (! errq) {
                    ret = result.map(tuple => ({
                         codret: 1
                        ,id: tuple.id
                        ,nome: tuple.name
                        ,email: tuple.email
                        ,fone: tuple.phone
                        ,companhia: tuple.company
                        ,cidade: tuple.city
                        ,registro: tuple.registered
                    }));

                    const chaveRedis = req.url.toString().substring(1).replace('/','-');
                    //console.log(chaveRedis);
                    connRedis.set(chaveRedis, JSON.stringify(ret), { EX : 120});
                } else {
                    status = 500; ret = { 
                                        codret: -1
                                        ,mensagem: errq.message
                                        ,code: errq.code
                                        ,errno: errq.errno
                                        ,name: errq.name
                                        ,sqlState: errq.sqlState
                                    };
                };
                return res.status(status).json(ret);
            });
        } else {
            status = 500; ret = { codret: -2, mensagem: mensagem.erroConexao };
            console.log(ret);
            return res.status(status).json(ret);
        };
    });
};

async function getPessoaId(req, res, next, connMySQL, connRedis) {
    var status = 200; var ret = {};
    const sql = "select * from person p where p.id = ?;"

    const id = req.params.id;

    await connMySQL.connect((err) => {
        if (err == null) {
            connMySQL.query(sql, [id], (errq, result, fields) => {
                if (! errq) {
                    if (result.length !== 0) {
                        ret = result.map(tuple => ({
                            codret: 1
                            ,id: tuple.id
                            ,nome: tuple.name
                            ,email: tuple.email
                            ,fone: tuple.phone
                            ,companhia: tuple.company
                            ,cidade: tuple.city
                            ,registro: tuple.registered
                        }));

                        const chaveRedis = req.url.toString().substring(1).replace('/','-');
                        //console.log(chaveRedis);
                        connRedis.set(chaveRedis, JSON.stringify(ret), { EX : 120});
                    } else {
                        status = 404; ret = { codret: 0, mensagem: "Registro não encontrado!" };
                    };
                } else {
                    status = 500; ret = { 
                                        codret: -1
                                        ,mensagem: errq.message
                                        ,code: errq.code
                                        ,errno: errq.errno
                                        ,name: errq.name
                                        ,sqlState: errq.sqlState
                                    };
                };
                return res.status(status).json(ret);
            });
        } else {
            status = 500; ret = { codret: -2, mensagem: mensagem.erroConexao };
            console.log(ret);
            return res.status(status).json(ret);
        };
    });
};

export { getPessoa, getPessoaId };
// eof