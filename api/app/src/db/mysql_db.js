import mysql from "mysql2";

async function mySQL_db() {
    try {
        const connMySQL = mysql.createConnection({
            // host: "localhost"
            host: "mysql-container-01"
            ,port : 3306
            ,database: "mydb"
            ,user: "root"
            ,password: "root"
            });
        console.log('Conectado no BD MySQL!')

        return connMySQL;
    }
    catch (error) {
        console.error(error);
        return null;
    }; 
};

export default mySQL_db;

















































































