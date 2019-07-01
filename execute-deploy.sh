#!/bin/bash

cd /home/ec2-user/ridi-new-entrant-web
nvm use 10.16.0
sudo docker-compose stop
sleep 10
sudo docker-compose up --build -d
