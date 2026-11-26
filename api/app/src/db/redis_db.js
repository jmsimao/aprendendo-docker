import { createClient } from "redis";
import "dotenv/config";

async function redis_db() {

    const _env = process.env;

    const connRedis = await createClient({
        url: _env.REDIS_URL
    })
    .on('error', (err) => {
        console.error('[x] ', _env.REDIS_MENS_CONEXAO_ERRO);
        console.error(err);
        return null;
    })
    .connect()
    ;
    
    console.log('[!]', _env.REDIS_MENS_CONEXAO_OK);
    return connRedis;

    /*
    await connRedis.connect();
    if (connRedis.isOpen) {
        console.log(_env.REDIS_MENS_CONEXAO_OK);
        return connRedis;
    } else {
        console.log(_env.REDIS_MENS_CONEXAO_ERRO);
        return null;
    };
    */
};




export default redis_db;






