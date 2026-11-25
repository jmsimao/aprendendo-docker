@echo off

docker restart node-container-01
docker logs node-container-01 -f