import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as logger from 'morgan';

import './passport';

import route from './routes';

import models from '../database/models';

class App {
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.syncDB();
    }

    public express: express.Application;

    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(express.json());

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

    public syncDB() {
        models.sequelize.sync().then( () => {
            console.log('동기화 성공');
        }).catch((err) => {
            console.log('연결 실패');
            console.log(err);
        });
    }
}

export default new App().express;
