import mysql from "mysql2";

async function mySQL_db() {
    try {
        const connMySQL = mysql.createConnection({
            host: "mysql-container"
            ,port : 3306
            ,database: "mydb"
            ,user: "root"
            ,password: "root"
            });

        return connMySQL;
    }
    catch (error) {
        console.error(error);
        return null;
    }; 
};

export default mySQL_db;

















































































