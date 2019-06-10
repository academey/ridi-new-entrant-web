import * as cors from 'cors';
import * as debug from 'debug';
import * as http from 'http';

import App from './App';

debug('ts-express:server');

const port = normalizePort(process.env.PORT || 8080);
App.set('port', port);
App.use(cors());
const server = http.createServer(App);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val: number|string): number|string|boolean {
  const p: number = (typeof val === 'string') ? parseInt(val, 10) : val;
  if (isNaN(p)) { return val; } else if (p >= 0) { return p; } else { return false; }
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') { throw error; }
  const bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  const addr: any = server.address();
  const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}
