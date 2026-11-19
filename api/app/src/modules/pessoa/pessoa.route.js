import { getPessoa, getPessoaId } from "./pessoa.controller.js";
import mySQL_db from "../../db/mysql_db.js";
import redis_db from "../../db/redis_db.js";

async function pessoa_route(app) {

    const connMySQL = await mySQL_db();
    const connRedis = await redis_db();

    app.get('/pessoa', async (req, res, next) => { 
        await getPessoa(req, res, next, connMySQL, connRedis);
    });

    app.get('/pessoa/:id', async (req, res, next) => {
        await getPessoaId(req, res, next, connMySQL, connRedis);
    });
};

export default pessoa_route;