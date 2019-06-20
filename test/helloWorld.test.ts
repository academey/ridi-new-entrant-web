// tests/hello.test.js
import * as request from 'supertest';
import App from '../src/server/App';

describe('Test /', () => {
  test('It should response the GET method', async () => {
    const response = await request(App).get('/');
    console.log('response.text is ', response.text);
    expect(response.statusCode).toBe(200);
  });
});
