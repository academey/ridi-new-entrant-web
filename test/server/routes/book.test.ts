import App from 'server/App';
import * as passport from 'server/passport';
import sinon from 'sinon';
import request from 'supertest';

import { NextFunction, Request, Response } from 'express';
import { isAuthenticated } from 'server/passport';
import {
  CLIENT_ERROR,
  CONFLICT_ERROR,
  CREATED_CODE,
  NOT_FOUND_ERROR,
  PARAM_VALIDATION_ERROR,
  SUCCESS_CODE,
} from 'server/routes/constants';
import bookReservationService from 'server/service/bookReservationService';
import bookService from 'server/service/bookService';
import reservationPenaltyService from 'server/service/reservationPenaltyService';
import {
  mockBook,
  mockBookId,
  mockBookList,
  mockBookParam,
  mockBookReservation,
  mockBookReservationParam,
  mockDelayedBookReservation,
  mockDelayedBookReservationParam,
  mockReservationPenalty,
  mockUserId,
} from '../constants';

describe('Test /api/books', () => {
  afterEach(() => {
    sinon.restore();
  });

  test('api book createOne', async () => {
    const bookServiceMock = sinon.mock(bookService);

    bookServiceMock
      .expects('create')
      .withArgs(mockBookParam)
      .resolves(mockBook);
    // TODO : 아직도 안 불려짐 왜인지는 모르겠음
    // bookServiceMock
    //   .expects('create')
    //   .withArgs(mockBookParam)
    //   .once();

    const response = await request(App)
      .post('/api/books')
      .send(mockBookParam)
      .expect(CREATED_CODE);
    expect(response.body.result).toEqual(mockBook);

    bookServiceMock.verify();
  });

  test('api book createOne Param Validation fail', async () => {
    await request(App)
      .post('/api/books')
      .send({ name: 'john' })
      .expect(PARAM_VALIDATION_ERROR);
  });

  test('api book getAll', async () => {
    const bookServiceMock = sinon.mock(bookService);

    bookServiceMock
      .expects('findAll')
      .withArgs()
      .resolves(mockBookList);

    const response = await request(App)
      .get('/api/books')
      .expect(SUCCESS_CODE);
    expect(response.body.result).toEqual(mockBookList);
  });

  test('api book getOne', async () => {
    const bookServiceMock = sinon.mock(bookService);
    bookServiceMock
      .expects('findById')
      .withArgs(mockBookId)
      .resolves(mockBook);

    const response = await request(App)
      .get(`/api/books/${mockBookId}`)
      .expect(SUCCESS_CODE);
    expect(response.body.result).toEqual(mockBook);
  });

  test('api book getOne Not found', async () => {
    const bookServiceMock = sinon.mock(bookService);
    bookServiceMock
      .expects('findById')
      .withArgs(mockBookId)
      .resolves(null);

    await request(App)
      .get(`/api/books/${mockBookId}`)
      .expect(NOT_FOUND_ERROR);
  });

  test('api book getOne Param Validation fail', async () => {
    await request(App)
      .get('/api/books/fdsfs')
      .expect(PARAM_VALIDATION_ERROR);
  });

  test('api book deleteOne', async () => {
    const bookServiceMock = sinon.mock(bookService);
    bookServiceMock
      .expects('destroyById')
      .withArgs(mockBookId)
      .resolves(1);

    const response = await request(App)
      .delete(`/api/books/${mockBookId}`)
      .expect(SUCCESS_CODE);
    expect(response.body.result).toEqual({ destroyedCount: 1 });
  });

  test('api book deleteOne Not found', async () => {
    const bookServiceMock = sinon.mock(bookService);
    bookServiceMock
      .expects('destroyById')
      .withArgs(mockBookId)
      .resolves(0);

    await request(App)
      .delete(`/api/books/${mockBookId}`)
      .expect(NOT_FOUND_ERROR);
  });

  test('api book deleteOne Param Validation fail', async () => {
    await request(App)
      .delete('/api/books/no_number')
      .expect(PARAM_VALIDATION_ERROR);
  });

  test('api book borrow', async () => {
    // TODO: 왜 이건 또 안 먹지?
    const passportMock = sinon.mock(passport);
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

    const bookServiceMock = sinon.mock(bookService);
    const bookReservationServiceMock = sinon.mock(bookReservationService);
    const reservationPenaltyServiceMock = sinon.mock(reservationPenaltyService);

    bookServiceMock
      .expects('findById')
      .withArgs(mockBookId)
      .resolves(mockBook);

    bookReservationServiceMock
      .expects('findByBookId')
      .withArgs(mockBookId)
      .resolves(null);
    reservationPenaltyServiceMock
      .expects('findOneLaterThanTime')
      .withArgs(mockUserId)
      .resolves(null);

    bookReservationServiceMock
      .expects('findOnePrevThanTime')
      .withArgs(mockUserId)
      .resolves(null);

    bookReservationServiceMock
      .expects('create')
      .withArgs(mockBookReservationParam)
      .resolves(mockBookReservation);

    const response = await request(App)
      .post(`/api/books/${mockBookId}/borrow`)
      .send(mockBookReservationParam)
      .expect(SUCCESS_CODE);
    expect(response.body.result).toEqual(mockBookReservation);
  });

  test('api book borrow Book not exists', async () => {
    const bookServiceMock = sinon.mock(bookService);
    bookServiceMock
      .expects('findById')
      .withArgs(mockBookId)
      .resolves(null);

    await request(App)
      .post(`/api/books/${mockBookId}/borrow`)
      .send(mockBookReservationParam)
      .expect(NOT_FOUND_ERROR);
  });

  test('api book borrow Book Reservation exists', async () => {
    const bookServiceMock = sinon.mock(bookService);
    const bookReservationServiceMock = sinon.mock(bookReservationService);
    bookServiceMock
      .expects('findById')
      .withArgs(mockBookId)
      .resolves(mockBook);

    bookReservationServiceMock
      .expects('findByBookId')
      .withArgs(mockBookId)
      .resolves(mockBookReservation);

    await request(App)
      .post(`/api/books/${mockBookId}/borrow`)
      .send(mockBookReservationParam)
      .expect(CONFLICT_ERROR);
  });

  test('api book borrow Book penalty or delayedReservation exists', async () => {
    const bookServiceMock = sinon.mock(bookService);
    const bookReservationServiceMock = sinon.mock(bookReservationService);
    const reservationPenaltyServiceMock = sinon.mock(reservationPenaltyService);

    bookServiceMock
      .expects('findById')
      .withArgs(mockBookId)
      .resolves(mockBook);

    bookReservationServiceMock
      .expects('findByBookId')
      .withArgs(mockBookId)
      .resolves(null);

    reservationPenaltyServiceMock
      .expects('findOneLaterThanTime')
      .withArgs(mockUserId)
      .resolves(null);

    bookReservationServiceMock
      .expects('findOnePrevThanTime')
      .withArgs(mockUserId)
      .resolves(mockReservationPenalty);

    await request(App)
      .post(`/api/books/${mockBookId}/borrow`)
      .send(mockBookReservationParam)
      .expect(CLIENT_ERROR);
  });

  test('api book borrow Param Validation fail', async () => {
    await request(App)
      .post(`/api/books/${mockBookId}/borrow`)
      .expect(PARAM_VALIDATION_ERROR);
  });

  test('api book borrow Param Validation isDate fail', async () => {
    await request(App)
      .post(`/api/books/${mockBookId}/borrow`)
      .send({
        endAt: '201922992-06-01',
      })
      .expect(PARAM_VALIDATION_ERROR);
  });

  test('api book return', async () => {
    const bookReservationServiceMock = sinon.mock(bookReservationService);
    bookReservationServiceMock
      .expects('findByBookId')
      .withArgs(mockBookId)
      .resolves(mockBookReservation);
    bookReservationServiceMock
      .expects('destroyById')
      .withArgs(mockUserId, mockBookId)
      .resolves(1);

    const response = await request(App)
      .post(`/api/books/${mockBookId}/return`)
      .send(mockBookReservationParam)
      .expect(SUCCESS_CODE);
    expect(response.body.result).toEqual({ destroyedCount: 1 });
  });

  test('api book delayed return', async () => {
    const bookReservationServiceMock = sinon.mock(bookReservationService);
    const reservationPenaltyServiceMock = sinon.mock(reservationPenaltyService);
    bookReservationServiceMock
      .expects('findByBookId')
      .withArgs(mockBookId)
      .resolves(mockDelayedBookReservation);

    reservationPenaltyServiceMock
      .expects('create')
      .resolves(mockDelayedBookReservation);

    // TODO: 이것도 작동해야 함.
    // reservationPenaltyServiceMock.expects('create').once();

    bookReservationServiceMock
      .expects('destroyById')
      .withArgs(mockUserId, mockBookId)
      .resolves(1);

    await request(App)
      .post(`/api/books/${mockBookId}/return`)
      .send(mockDelayedBookReservationParam)
      .expect(SUCCESS_CODE);
    reservationPenaltyServiceMock.verify();
  });

  test('api book return Not found', async () => {
    const bookReservationServiceMock = sinon.mock(bookReservationService);
    bookReservationServiceMock
      .expects('findByBookId')
      .withArgs(mockBookId)
      .resolves(null);

    await request(App)
      .post(`/api/books/${mockBookId}/return`)
      .send(mockBookReservationParam)
      .expect(NOT_FOUND_ERROR);
  });

  test('api book return Param Validation fail', async () => {
    await request(App)
      .post(`/api/books/no_number/return`)
      .expect(PARAM_VALIDATION_ERROR);
  });

  test('api book checkAvailableToBorrow availableToBorrow True', async () => {
    const bookReservationServiceMock = sinon.mock(bookReservationService);
    const reservationPenaltyServiceMock = sinon.mock(reservationPenaltyService);

    reservationPenaltyServiceMock
      .expects('findOneLaterThanTime')
      .withArgs(mockUserId)
      .resolves(null);
    bookReservationServiceMock
      .expects('findOnePrevThanTime')
      .withArgs(mockUserId)
      .resolves(null);

    const response = await request(App)
      .post(`/api/books/check_available_to_borrow`)
      .send(mockBookReservationParam)
      .expect(SUCCESS_CODE);
    expect(response.body.result.availableToBorrow).toBeTruthy();
  });

  test('api book delayed checkAvailableToBorrow availableToBorrow false due to reservationPenalty', async () => {
    const bookReservationServiceMock = sinon.mock(bookReservationService);
    const reservationPenaltyServiceMock = sinon.mock(reservationPenaltyService);
    reservationPenaltyServiceMock
      .expects('findOneLaterThanTime')
      .withArgs(mockUserId)
      .resolves(mockReservationPenalty);
    bookReservationServiceMock
      .expects('findOnePrevThanTime')
      .withArgs(mockUserId)
      .resolves(null);

    const response = await request(App)
      .post(`/api/books/check_available_to_borrow`)
      .send(mockDelayedBookReservationParam)
      .expect(SUCCESS_CODE);
    expect(response.body.result.availableToBorrow).toBeFalsy();
  });

  test('api book delayed checkAvailableToBorrow availableToBorrow false due to delayedBookReservation', async () => {
    const bookReservationServiceMock = sinon.mock(bookReservationService);
    const reservationPenaltyServiceMock = sinon.mock(reservationPenaltyService);
    reservationPenaltyServiceMock
      .expects('findOneLaterThanTime')
      .withArgs(mockUserId)
      .resolves(null);
    bookReservationServiceMock
      .expects('findOnePrevThanTime')
      .withArgs(mockUserId)
      .resolves(mockDelayedBookReservation);

    const response = await request(App)
      .post(`/api/books/check_available_to_borrow`)
      .send(mockDelayedBookReservationParam)
      .expect(SUCCESS_CODE);
    expect(response.body.result.availableToBorrow).toBeFalsy();
  });

  test('api book delayed checkAvailableToBorrow availableToBorrow false due to both of them', async () => {
    const bookReservationServiceMock = sinon.mock(bookReservationService);
    const reservationPenaltyServiceMock = sinon.mock(reservationPenaltyService);
    reservationPenaltyServiceMock
      .expects('findOneLaterThanTime')
      .withArgs(mockUserId)
      .resolves(mockReservationPenalty);
    bookReservationServiceMock
      .expects('findOnePrevThanTime')
      .withArgs(mockUserId)
      .resolves(mockDelayedBookReservation);

    const response = await request(App)
      .post(`/api/books/check_available_to_borrow`)
      .send(mockDelayedBookReservationParam)
      .expect(SUCCESS_CODE);
    expect(response.body.result.availableToBorrow).toBeFalsy();
  });
});
