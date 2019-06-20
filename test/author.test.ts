import request from 'supertest';
import App from '../src/server/App';

describe('Test /api/author', () => {
  test('api author createOne', async () => {
    const response = await request(App)
      .post('/api/author')
      .send({ name: 'john', desc: 'test' });
    const author = response.body.author;

    expect(response.status).toBe(200);
    expect(author.name).toBe('john');
  });

  test('api author getAll', async () => {
    const response = await request(App).get('/api/author');
    console.log('response.text is ', response.body);
    const authors = response.body.authors;

    expect(response.status).toBe(200);
    expect(authors.length).toBe(3);
  });

  test('api author getOne', async () => {
    const response = await request(App).get('/api/author/10');
    const author = response.body.author;

    expect(response.status).toBe(200);
    expect(author.name).toBe('John Doe');
  });

  test('api author deleteOne', async () => {
    const createResponse = await request(App)
      .post('/api/author')
      .send({ name: 'john', desc: 'test' });
    const author = createResponse.body.author;

    const response = await request(App).delete(`/api/author/${author.id}`);

    expect(response.status).toBe(200);
  });
});
