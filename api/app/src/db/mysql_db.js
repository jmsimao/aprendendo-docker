import mysql from "mysql2";
import "dotenv/config";

async function mySQL_db() {
    try {
        const _env = process.env;
     
        const connMySQL = mysql.createConnection({
            host: _env.MYSQL_HOST
            ,port : _env.MYSQL_PORT
            ,database: _env.MYSQL_DATABASE
            ,user: _env.MYSQL_USER
            ,password: _env.MYSQL_PASSWORD
            });
        console.log('[!]', _env.MYSQL_MENS_CONEXAO_OK);

        return connMySQL;
    }
    catch (error) {
        console.error('[x] ', error);
        return null;
    }; 
};

export default mySQL_db;

















































































