import * as express from 'express';

import accountRouter from './account';
import authRouter from './auth';
import authorRouter from './author';
import book from './book';

const PREFIX = '/api';

export default function(app: express.Application) {
  app.use(PREFIX + '/account', accountRouter);
  app.use(PREFIX + '/auth', authRouter);
  app.use(PREFIX + '/authors', authorRouter);
  app.use(PREFIX + '/books', book);
}
