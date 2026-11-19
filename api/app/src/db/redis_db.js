import redis from "redis";

async function redis_db() {

    const connRedis = redis.createClient({
        url: "redis://redis-container:6379"
    });

    await connRedis.connect()
    if (connRedis.isOpen) {
        console.log('Conectado no BD Redis!');
        return connRedis;
    } else {
        console.log('Erro ao conectar no BD Redis!');
        return null;
    };
};

export default redis_db;






