CREATE DATABASE IF NOT EXISTS mydb;
USE mydb;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT,
  name VARCHAR(255),
  price DECIMAL(10, 2),
  PRIMARY KEY (id)
);


delete from products;
INSERT INTO products VALUES (1, 'Curso Front-end especialista', 2500);
INSERT INTO products VALUEs (2, 'Curso JS Fullstack', 900);
commit;

SELECT * FROM PRODUCTS;