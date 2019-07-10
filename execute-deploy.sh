#!/bin/sh

source /home/ec2-user/.bash_profile
cd /home/ec2-user/ridi-new-entrant-web
sudo nvm use 10.16.0
sudo docker-compose stop
sleep 10
npm run compose-prod
