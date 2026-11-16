@echo off

REM docker build -t mysql-image -f db\Dockerfile db\.
REM docker build -t node-image -f .\api\Dockerfile .\api\.
REM docker build -t php-image -f .\website\Dockerfile .\website\.
REM docker build -t postgres-image -f .\db1\Dockerfile .\db1\.

docker stop php-container node-container mysql-container postgres-container 

docker run -d --rm --name mysql-container -p 3306:3306 -v ".\db\mysql\data:/var/lib/mysql" mysql-image
docker run -d --rm --name node-container -p 9001:9001 -v ".\api\app:/home/node/app" --link mysql-container node-image
docker run -d --rm --name php-container -p 8080:80 -v ".\website\html:/var/www/html" --link node-container php-image
docker run -d --rm --name postgres-container -p 5433:5432 -v ".\db1\postgresql:/var/lib/postgresql" postgres-image