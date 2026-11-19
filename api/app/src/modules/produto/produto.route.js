import mySQL_db from "../../db/mysql_db.js";
import redis_db from "../../db/redis_db.js";
import { getProduto } from "./produto.controller.js";

async function produto_route(app) {

    const connMySQL = await mySQL_db();
    const connRedis = await redis_db();
    
    app.get('/produto', async (req, res, next) => {
        await getProduto(req, res, next, connMySQL, connRedis);
    });

};

export default produto_route;