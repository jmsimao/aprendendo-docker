@echo off

echo "Stop containers..."
docker container stop php-container-01 node-container-01 mysql-container-01 postgres-container-01 redis-container-01
echo "Remove containers..."
docker container remove php-container-01 node-container-01 mysql-container-01 postgres-container-01 redis-container-01