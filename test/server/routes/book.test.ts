import { Book } from 'database/models/Book';
import { BookReservation } from 'database/models/BookReservation';
import App from 'server/App';
import * as passport from 'server/passport';
import sinon from 'sinon';
import request from 'supertest';

import { NextFunction, Request, Response } from 'express';
import { isAuthenticated } from 'server/passport';
import {
  mockBook,
  mockBookId,
  mockBookList,
  mockBookParam,
  mockBookReservation,
  mockBookReservationParam,
  mockUserId,
  whereQuery,
} from '../constants';

describe('Test /api/books', () => {
  afterEach(() => {
    sinon.restore();
  });

  test('api book createOne', async () => {
    const bookMock = sinon.mock(Book);

    bookMock
      .expects('create')
      .withArgs(mockBookParam)
      .resolves(mockBook);
    // TODO : 아래 코드가 never called 인데 이유를 모르겠음.
    // bookMock
    //   .expects('create')
    //   .once()
    //   .withArgs(mockBookParam);
    const response = await request(App)
      .post('/api/books')
      .send(mockBookParam)
      .expect(201);
    expect(response.body.result).toEqual(mockBook);

    bookMock.verify();
  });

  test('api book createOne Param Validation fail', async () => {
    await request(App)
      .post('/api/books')
      .send({ name: 'john' })
      .expect(422);
  });

  test('api book getAll', async () => {
    const bookMock = sinon.mock(Book);
    bookMock
      .expects('findAll')
      .withArgs()
      .resolves(mockBookList);

    const response = await request(App)
      .get('/api/books')
      .expect(200);
    expect(response.body.result).toEqual(mockBookList);

    bookMock.verify();
  });

  test('api book getOne', async () => {
    const bookMock = sinon.mock(Book);
    bookMock
      .expects('findByPk')
      .withArgs(1)
      .resolves(mockBook);

    const response = await request(App)
      .get('/api/books/1')
      .expect(200);
    expect(response.body.result).toEqual(mockBook);

    bookMock.verify();
  });

  test('api book getOne Not found', async () => {
    const bookMock = sinon.mock(Book);
    bookMock
      .expects('findByPk')
      .withArgs(1)
      .resolves(null);

    await request(App)
      .get('/api/books/1')
      .expect(404);
  });

  test('api book getOne Param Validation fail', async () => {
    await request(App)
      .get('/api/books/fdsfs')
      .expect(422);
  });

  test('api book deleteOne', async () => {
    const bookMock = sinon.mock(Book);
    bookMock
      .expects('destroy')
      .withArgs({
        where: {
          id: 1,
        },
      })
      .resolves(1);

    const response = await request(App)
      .delete('/api/books/1')
      .expect(200);
    expect(response.body.result).toEqual({ destroyedCount: 1 });

    bookMock.verify();
  });

  test('api book deleteOne Not found', async () => {
    const bookMock = sinon.mock(Book);
    bookMock
      .expects('destroy')
      .withArgs({
        where: {
          id: 1,
        },
      })
      .resolves(0);

    await request(App)
      .delete('/api/books/1')
      .expect(404);
  });

  test('api book deleteOne Param Validation fail', async () => {
    await request(App)
      .delete('/api/books/no_number')
      .expect(422);
  });

  test('api book borrow', async () => {
    const passportMock = sinon.mock(passport);
    const bookMock = sinon.mock(Book);
    bookMock
      .expects('findByPk')
      .withArgs(mockBookId)
      .resolves(mockBook);
    const bookReservationMock = sinon.mock(BookReservation);
    bookReservationMock
      .expects('findOne')
      .withArgs(
        whereQuery({
          bookId: mockBookId,
        }),
      )
      .resolves(null);
    // TODO: 왜 이건 또 안 먹지?
    passportMock
      .expects('isAuthenticated')
      .returns((req: Request, res: Response, next: NextFunction) => {
        console.log('huhu');
        const user = {
          id: 2,
          nickname: 'Outsider',
        };
        next(null);
      });
    bookReservationMock
      .expects('create')
      .withArgs(mockBookReservationParam)
      .resolves(mockBookReservation);

    const response = await request(App)
      .post(`/api/books/${mockBookId}/borrow`)
      .send(mockBookReservationParam)
      .expect(200);
    expect(response.body.result).toEqual(mockBookReservation);

    bookReservationMock.verify();
  });

  test('api book borrow Book not exists', async () => {
    const bookMock = sinon.mock(Book);
    bookMock
      .expects('findByPk')
      .withArgs(mockBookId)
      .resolves(null);

    await request(App)
      .post(`/api/books/${mockBookId}/borrow`)
      .send(mockBookReservationParam)
      .expect(404);
  });

  test('api book borrow Book Reservation exists', async () => {
    const bookMock = sinon.mock(Book);
    bookMock
      .expects('findByPk')
      .withArgs(mockBookId)
      .resolves(mockBook);

    const bookReservationMock = sinon.mock(BookReservation);
    bookReservationMock
      .expects('findOne')
      .withArgs(
        whereQuery({
          bookId: mockBookId,
        }),
      )
      .resolves(mockBookReservation);

    await request(App)
      .post(`/api/books/${mockBookId}/borrow`)
      .send(mockBookReservationParam)
      .expect(409);
  });

  test('api book borrow Param Validation fail', async () => {
    await request(App)
      .post(`/api/books/${mockBookId}/borrow`)
      .expect(422);
  });

  test('api book borrow Param Validation isDate fail', async () => {
    await request(App)
      .post(`/api/books/${mockBookId}/borrow`)
      .send({
        endAt: '201922992-06-01',
      })
      .expect(422);
  });

  test('api book return', async () => {
    const bookReservationMock = sinon.mock(BookReservation);
    bookReservationMock
      .expects('findOne')
      .withArgs(
        whereQuery({
          bookId: mockBookId,
        }),
      )
      .resolves(mockBookReservation);
    bookReservationMock
      .expects('destroy')
      .withArgs(
        whereQuery({
          userId: mockUserId,
          bookId: mockBookId,
        }),
      )
      .resolves(1);

    const response = await request(App)
      .post(`/api/books/${mockBookId}/return`)
      .send(mockBookReservationParam)
      .expect(200);
    expect(response.body.result).toEqual({ destroyedCount: 1 });

    bookReservationMock.verify();
  });

  test('api book return Not found', async () => {
    const bookReservationMock = sinon.mock(BookReservation);
    bookReservationMock
      .expects('findOne')
      .withArgs(
        whereQuery({
          bookId: mockBookId,
        }),
      )
      .resolves(null);

    await request(App)
      .post(`/api/books/${mockBookId}/return`)
      .send(mockBookReservationParam)
      .expect(404);
  });

  test('api book return Param Validation fail', async () => {
    await request(App)
      .post(`/api/books/no_number/return`)
      .expect(422);
  });
});
