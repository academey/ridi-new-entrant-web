#!/bin/bash

cd /home/ec2-user/ridi-new-entrant-web
sudo docker-compose stop
sleep 10
sudo docker-compose -f docker-compose.prod.yml up --build
