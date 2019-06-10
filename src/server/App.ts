import * as express from 'express';
import * as logger from 'morgan';
import route from './routes';
import * as path from 'path';

import models from '../database/models';

// Creates and configures an ExpressJS web server.
class App {

    // Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.syncDB();
    }

    // ref to Express instance
    public express: express.Application;

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(express.json());
    }

    // Configure API endpoints.
    private routes(): void {
        /* This is just to get up and running, and to make sure what we've got is
         * working so far. This function will change when we start to add more
         * API endpoints */
        const router = express.Router();
        // placeholder route handler
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
