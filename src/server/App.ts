import * as bodyParser from 'body-parser';
import cors from 'cors';
import express, { NextFunction } from 'express';
import logger from 'morgan';
import { ValidationError } from 'property-validator';

import './passport';

import { makeFailResponse } from 'server/utils/result';
import models from '../database/models';
import route from './routes';

class App {
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    this.errorHandling();
    this.syncDB();
  }

  public express: express.Application;

  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(express.json());
    this.express.use(cors());
    this.express.use(bodyParser.urlencoded({ extended: true }));
  }

  private routes(): void {
    const router = express.Router();

    router.get('/', (req, res, next) => {
      res.json({
        message: 'Hello World!',
      });
    });

    this.express.use('/', router);

    route(this.express);
  }

  private errorHandling(): void {
    this.express.use((err: Error, req: any, res: any, next: NextFunction) => {
      if (!err) {
        return next(err);
      }

      if (err instanceof ValidationError) {
        return res.status(422).json(makeFailResponse(err.message));
      } else {
        return res.status(500).json(makeFailResponse(err.message));
      }
    });
  }

  public syncDB() {
    models.sequelize
      .sync()
      .then(() => {
        console.log('동기화 성공');
      })
      .catch((err: any) => {
        console.log('연결 실패');
        console.log(err);
      });
  }
}

export default new App().express;
