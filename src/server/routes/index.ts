import * as express from 'express';
import authorRouter from './author';
import book from './book';

const PREFIX = '/api';

export default function(app: express.Application) {
    app.use(PREFIX + '/author', authorRouter);
    app.use(PREFIX + '/book', book);

    app.get('/', (req, res) => {
        res.render('index.js.ts.html');
    });
}
