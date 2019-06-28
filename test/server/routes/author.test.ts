import { Author } from 'database/models/Author';
import App from 'server/App';
import sinon from 'sinon';
import request from 'supertest';
import {
  mockAuthor,
  mockAuthorList,
  mockAuthorParam,
  mockBook,
} from '../constants';

describe('Test /api/authors', () => {
  afterEach(() => {
    sinon.restore();
  });

  test('api authors createOne', async () => {
    const authorMock = sinon.mock(Author);

    authorMock
      .expects('create')
      .withArgs(mockAuthorParam)
      .resolves(mockAuthor);
    // TODO : 아래 코드가 never called 인데 이유를 모르겠음.
    // authorMock
    //   .expects('create')
    //   .once()
    //   .withArgs(mockAuthorParam);
    const response = await request(App)
      .post('/api/authors')
      .send(mockAuthorParam)
      .expect(200);
    expect(response.body.result).toEqual(mockAuthor);

    authorMock.verify();
  });

  test('api authors createOne Param Validation fail', async () => {
    await request(App)
      .post('/api/authors')
      .send({ name: 'john' })
      .expect(422);
  });

  test('api authors getAll', async () => {
    const authorMock = sinon.mock(Author);

    authorMock
      .expects('findAll')
      .withArgs()
      .resolves(mockAuthorList);

    const response = await request(App)
      .get('/api/authors')
      .expect(200);
    expect(response.body.result).toEqual(mockAuthorList);

    authorMock.restore();
    authorMock.verify();
  });

  test('api authors getOne', async () => {
    const authorMock = sinon.mock(Author);
    authorMock
      .expects('findByPk')
      .withArgs(1)
      .resolves(mockBook);

    const response = await request(App)
      .get('/api/authors/1')
      .expect(200);
    expect(response.body.result).toEqual(mockBook);

    authorMock.verify();
  });

  test('api authors getOne Not found', async () => {
    const authorMock = sinon.mock(Author);
    authorMock
      .expects('findByPk')
      .withArgs(1)
      .resolves(null);

    await request(App)
      .get('/api/authors/1')
      .expect(404);
  });

  test('api authors getOne Param Validation fail', async () => {
    await request(App)
      .get('/api/authors/fdsfs')
      .expect(422);
  });

  test('api authors deleteOne', async () => {
    const authorMock = sinon.mock(Author);
    authorMock
      .expects('destroy')
      .withArgs({
        where: {
          id: 1,
        },
      })
      .resolves(1);

    const response = await request(App)
      .delete('/api/authors/1')
      .expect(200);
    expect(response.body.result).toEqual({ destroyedCount: 1 });

    authorMock.verify();
  });

  test('api authors deleteOne Not found', async () => {
    const authorMock = sinon.mock(Author);
    authorMock
      .expects('destroy')
      .withArgs({
        where: {
          id: 1,
        },
      })
      .resolves(0);

    await request(App)
      .delete('/api/authors/1')
      .expect(404);
  });

  test('api authors deleteOne Param Validation fail', async () => {
    await request(App)
      .delete('/api/authors/no_number')
      .expect(422);
  });
});
