// tests/hello.test.js
import request from 'supertest';
import App from '../src/server/App';

describe('Test /', () => {
  test('It should response the GET method', async () => {
    const response = await request(App).get('/');
    console.log('response.text is ', response.text);
    expect(response.status).toBe(200);
  });
});
