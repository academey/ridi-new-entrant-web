import * as cors from 'cors';
import * as express from 'express';

import models from '../database/models/index';
import route from './routes';

const app = express();
const port = 8080;

app.use(cors());

// TODO: force 는 개발 환경에서만 쓰도록
models.sequelize.sync({force: true}).then( () => {
  console.log('동기화 성공');
}).catch((err) => {
  console.log('연결 실패');
  console.log(err);
});

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('This is API Server for ridi new entrant web!');
});

app.listen(port, () => {
  console.log(`Express listening on port ${port}.`);
});

route(app);
