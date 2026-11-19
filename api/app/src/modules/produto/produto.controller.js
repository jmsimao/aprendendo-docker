import mensagem from "../../shared/utils/mensagem.js";

async function getProduto(req, res, next, connMySQL, connRedis) {
    var status = 200; var ret = {};
    const sql = "select * from products p order by p.name;";

    await connMySQL.connect((err) => {
        if (err == null) {
            connMySQL.query(sql, (errq, result, fields) => {
                if (! errq) {
                    ret = result.map(tuple => ({
                        codret: 1
                        ,id: tuple.id
                        ,produto: tuple.name
                        ,valor: tuple.price
                        ,ativo: true
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

export { getProduto };