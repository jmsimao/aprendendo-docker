echo off
REM cls

docker container run -d --rm --name mysql-container -p 3306:3306 -v D:\Docker\docker-introducao\db\mysql\data:/var/lib/mysql mysql-image
docker container logs mysql-container -f