import * as express from 'express'; // 1
const app = express();

app.get('/', (req: express.Request, res: express.Response) => {
  // 2
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
