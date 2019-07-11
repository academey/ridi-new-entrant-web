import { Author } from 'database/models/Author';
import App from 'server/App';
import {
  CREATED_CODE,
  NOT_FOUND_ERROR,
  PARAM_VALIDATION_ERROR,
  SUCCESS_CODE,
} from 'server/routes/constants';
import authorService from 'server/service/authorService';
import request from 'supertest';
import {
  mockAuthor,
  mockAuthorId,
  mockAuthorList,
  mockAuthorParam,
} from '../constants';

jest.mock('database/models');
jest.mock('server/service/authorService');

const mockedAuthorService = authorService as jest.Mocked<typeof authorService>;

describe('Test /api/authors', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('api authors createOne', () => {
    test('api authors createOne', async () => {
      mockedAuthorService.create.mockResolvedValue(mockAuthor as Author);

      const response = await request(App)
        .post('/api/authors')
        .send(mockAuthorParam)
        .expect(CREATED_CODE);
      expect(response.body.result).toEqual(mockAuthor);
      expect(mockedAuthorService.create).toBeCalledWith(mockAuthorParam);
      expect(mockedAuthorService.create.mock.calls.length).toEqual(1);
    });

    test('api authors createOne Param Validation fail', async () => {
      await request(App)
        .post('/api/authors')
        .send({ name: 'john' })
        .expect(PARAM_VALIDATION_ERROR);
    });
  });

  describe('api authors getAll', () => {
    test('api authors getAll', async () => {
      mockedAuthorService.findAll.mockResolvedValue(mockAuthorList as Author[]);

      const response = await request(App)
        .get('/api/authors')
        .expect(SUCCESS_CODE);
      expect(response.body.result).toEqual(mockAuthorList);
      expect(mockedAuthorService.findAll).toBeCalledWith();
    });
  });

  describe('api authors getOne', () => {
    test('api authors getOne', async () => {
      mockedAuthorService.findById.mockResolvedValue(mockAuthor as Author);

      const response = await request(App)
        .get(`/api/authors/${mockAuthorId}`)
        .expect(SUCCESS_CODE);
      expect(response.body.result).toEqual(mockAuthor);
      expect(mockedAuthorService.findById).toBeCalledWith(mockAuthorId);
    });

    test('api authors getOne Not found', async () => {
      mockedAuthorService.findById.mockResolvedValue(null);

      await request(App)
        .get(`/api/authors/${mockAuthorId}`)
        .expect(NOT_FOUND_ERROR);
      expect(mockedAuthorService.findById).toBeCalledWith(mockAuthorId);
    });

    test('api authors getOne Param Validation fail', async () => {
      await request(App)
        .get('/api/authors/fdsfs')
        .expect(PARAM_VALIDATION_ERROR);
    });
  });
  describe('api authors deleteOne', () => {
    test('api authors deleteOne', async () => {
      mockedAuthorService.destroyById.mockResolvedValue(1);

      const response = await request(App)
        .delete(`/api/authors/${mockAuthorId}`)
        .expect(SUCCESS_CODE);
      expect(response.body.result).toEqual({ destroyedCount: 1 });
      expect(mockedAuthorService.destroyById).toBeCalledWith(mockAuthorId);
    });

    test('api authors deleteOne Not found', async () => {
      mockedAuthorService.destroyById.mockResolvedValue(0);

      await request(App)
        .delete(`/api/authors/${mockAuthorId}`)
        .expect(NOT_FOUND_ERROR);
      expect(mockedAuthorService.destroyById).toBeCalledWith(mockAuthorId);
    });

    test('api authors deleteOne Param Validation fail', async () => {
      await request(App)
        .delete('/api/authors/no_number')
        .expect(PARAM_VALIDATION_ERROR);
    });
  });
});
