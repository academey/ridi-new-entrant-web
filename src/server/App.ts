import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction } from 'express';
import logger from 'morgan';
import { ValidationError } from 'property-validator';

import './passport';

import { PARAM_VALIDATION_ERROR, SERVER_ERROR } from 'server/routes/constants';
import {
  getClientHost,
  isProduction,
  isTest,
} from 'server/utils/envChecker';
import { makeFailResponse } from 'server/utils/result';
import models from '../database/models';
import route from './routes';

class App {
  constructor() {
    if (App.instance) {
      return App.instance;
    }
    App.instance = this;
    this.express = express();
    this.hostBundle();
    this.middleware();
    this.routes();
    this.errorHandling();
    this.syncDB();
  }
  public static instance: App;
  public express: express.Application;

  private hostBundle(): void {
    if (isProduction()) {
      this.express.use('/', express.static('build'));
    }
  }

  private middleware(): void {
    if (isProduction()) {
      this.express.use(logger('combined'));
    } else {
      this.express.use(logger('dev'));
    }
    this.express.use(cors({ credentials: true, origin: getClientHost() }));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(cookieParser());
  }

  private routes(): void {
    route(this.express);
  }

  private errorHandling(): void {
    this.express.use((err: Error, req: any, res: any, next: NextFunction) => {
      if (!err) {
        return next(err);
      }

      if (err instanceof ValidationError) {
        return makeFailResponse(res, PARAM_VALIDATION_ERROR, err.message);
      } else {
        return makeFailResponse(res, SERVER_ERROR, err.message);
      }
    });
  }

  public async syncDB() {
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
  }
}

export default new App().express;
