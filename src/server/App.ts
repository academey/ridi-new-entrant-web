import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import models from 'database/models';
import express, { NextFunction } from 'express';
import logger from 'morgan';
import { ValidationError } from 'property-validator';
import { PARAM_VALIDATION_ERROR, SERVER_ERROR } from 'server/routes/constants';
import {
  isProduction,
  isTest,
} from 'server/utils/envChecker';
import { makeFailResponse } from 'server/utils/result';
import passportStrategy from './passport';
import route from './routes';

const hostBundle = (app: express.Application) => {
  if (isProduction()) {
    app.use('/', express.static('build'));
  }
};

const middleware = (app: express.Application) => {
  passportStrategy();
  corsSetting(app);

  if (isProduction()) {
    app.use(logger('combined'));
  } else {
    app.use(logger('dev'));
  }
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
};

const corsSetting = (app: express.Application) => {
  const whitelist = ['http://0.0.0.0:3000', 'http://0.0.0.0', 'http://54.180.137.113'];
  app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }));
};

const errorHandling = (app: express.Application) => {
  app.use((err: Error, req: any, res: any, next: NextFunction) => {
    if (!err) {
      return next(err);
    }

    if (err instanceof ValidationError) {
      return makeFailResponse(res, PARAM_VALIDATION_ERROR, err.message);
    } else {
      console.log(err);
      return makeFailResponse(res, SERVER_ERROR, err.message);
    }
  });
};

const syncDB = async () => {
  try {
    if (isTest() || isProduction()) {
      return;
    }
    await models.sequelize.sync();
    console.log('동기화 성공');
  } catch (error) {
    console.log('연결 실패');
    console.log(error);
  }
};

const server: express.Application = express();

hostBundle(server);
middleware(server);
route(server);
errorHandling(server);
syncDB();

export default server;
