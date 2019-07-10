#!/bin/bash

if [ "development" == "$1" ]; then
  dockerize -wait tcp://composed-maria-db:3306 -timeout 20s
  ./node_modules/.bin/sequelize db:migrate
  ./node_modules/.bin/sequelize db:seed:all
  npm run dev
elif [ "production" == "$1" ]; then
  echo "PRODUCTION"
  dockerize -wait tcp://composed-maria-db:3306 -timeout 20s
  npm run prod
fi
