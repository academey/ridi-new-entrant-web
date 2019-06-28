#!/bin/bash

dockerize -wait tcp://db:3306 -timeout 20s
./node_modules/.bin/sequelize db:migrate
./node_modules/.bin/sequelize db:seed:all
npm run dev