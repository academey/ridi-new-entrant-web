import { Book } from 'database/models/Book';
import { NextFunction, Request, Response } from 'express';
import moment = require('moment');
import App from 'server/App';
import { isAuthenticated } from 'server/passport';
import {
  CLIENT_ERROR,
  CONFLICT_ERROR,
  CREATED_CODE,
  NOT_AUTHORIZED_ERROR,
  NOT_FOUND_ERROR,
  PARAM_VALIDATION_ERROR,
  SERVER_ERROR,
  SUCCESS_CODE,
} from 'server/routes/constants';
import bookReservationService from 'server/service/bookReservationService';
import bookService from 'server/service/bookService';
import reservationPenaltyService from 'server/service/reservationPenaltyService';
import request from 'supertest';
import {
  mockAnotherPersonBorrowedBookReservation,
  mockBook,
  mockBookId,
  mockBookList,
  mockBookParam,
  mockBookReservation,
  mockBookReservationParam,
  mockDelayedBookReservation,
  mockDelayedBookReservationParam,
  mockReservationPenalty,
  mockTransactionOptions,
  mockUser,
  mockUserId,
} from '../constants';

jest.mock('database/models');
jest.mock('server/passport');
jest.mock('server/service/bookReservationService');
jest.mock('server/service/bookService');
jest.mock('server/service/reservationPenaltyService');

const mockIsAuthenticated = isAuthenticated as jest.Mock;
const mockedBookService = bookService as jest.Mocked<typeof bookService>;
const mockedBookReservationService = bookReservationService as jest.Mocked<
  typeof bookReservationService
>;
const mockedReservationPenaltyService = reservationPenaltyService as jest.Mocked<
  typeof reservationPenaltyService
>;

describe('Test /api/books', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    mockIsAuthenticated.mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        req.user = mockUser;
        return next(null);
      },
    );
  });

  describe('api book createOne', () => {
    test('api book createOne', async () => {
      mockedBookService.create.mockResolvedValue(mockBook as Book);
      const response = await request(App)
        .post('/api/books')
        .send(mockBookParam)
        .expect(CREATED_CODE);

      expect(response.body.result).toEqual(mockBook);
      expect(mockedBookService.create).toBeCalledWith(mockBookParam);
      expect(mockedBookService.create.mock.calls.length).toEqual(1);
    });

    test('api book createOne Param Validation fail', async () => {
      await request(App)
        .post('/api/books')
        .send({ name: 'john' })
        .expect(PARAM_VALIDATION_ERROR);
    });
  });

  describe('api book getAll', () => {
    test('api book getAll', async () => {
      mockedBookService.findAll.mockResolvedValue(mockBookList as Book[]);
      const response = await request(App)
        .get('/api/books')
        .expect(SUCCESS_CODE);
      expect(response.body.result).toEqual(mockBookList);
      expect(mockedBookService.findAll).toBeCalledWith();
    });
  });

  describe('api book getOne', () => {
    mockedBookService.findById.mockResolvedValue(mockBook as Book);

    test('api book getOne', async () => {
      // mockedBookService.findById.mockResolvedValue(mockBook as Book);

      const response = await request(App)
        .get(`/api/books/${mockBookId}`)
        .expect(SUCCESS_CODE);
      expect(response.body.result).toEqual(mockBook);
      expect(mockedBookService.findById).toBeCalledWith(mockBookId);
    });

    test('api book getOne Not found', async () => {
      mockedBookService.findById.mockResolvedValue(null);

      await request(App)
        .get(`/api/books/${mockBookId}`)
        .expect(NOT_FOUND_ERROR);
      expect(mockedBookService.findById).toBeCalledWith(mockBookId);
    });

    test('api book getOne Param Validation fail', async () => {
      await request(App)
        .get('/api/books/fdsfs')
        .expect(PARAM_VALIDATION_ERROR);
    });
  });

  describe('api book deleteOne', () => {
    test('api book deleteOne', async () => {
      mockedBookService.destroyById.mockResolvedValue(mockBookId);

      const response = await request(App)
        .delete(`/api/books/${mockBookId}`)
        .expect(SUCCESS_CODE);
      expect(response.body.result).toEqual({ destroyedCount: 1 });
      expect(mockedBookService.destroyById).toBeCalledWith(mockBookId);
    });

    test('api book deleteOne Not found', async () => {
      mockedBookService.destroyById.mockResolvedValue(0);

      await request(App)
        .delete(`/api/books/${mockBookId}`)
        .expect(NOT_FOUND_ERROR);
      expect(mockedBookService.destroyById).toBeCalledWith(mockBookId);
    });

    test('api book deleteOne Param Validation fail', async () => {
      await request(App)
        .delete('/api/books/no_number')
        .expect(PARAM_VALIDATION_ERROR);
    });
  });

  describe('api book borrow', () => {
    test('api book borrow', async () => {
      mockedBookService.findById.mockResolvedValue(mockBook as Book);
      mockedBookReservationService.findByBookId.mockResolvedValue(null);
      mockedReservationPenaltyService.findOneLaterThanTime.mockResolvedValue(
        null,
      );
      mockedBookReservationService.findOnePrevThanTime.mockResolvedValue(null);
      mockedBookReservationService.create.mockResolvedValue(
        mockBookReservation as any,
      );

      const response = await request(App)
        .post(`/api/books/${mockBookId}/borrow`)
        .send(mockBookReservationParam)
        .expect(SUCCESS_CODE);
      expect(response.body.result).toEqual(mockBookReservation);
      expect(mockedBookService.findById).toBeCalledWith(mockBookId);
      expect(mockedBookReservationService.findByBookId).toBeCalledWith(
        mockBookId,
      );
      expect(
        mockedReservationPenaltyService.findOneLaterThanTime,
      ).toBeCalledWith(mockUserId, expect.any(moment));
      expect(mockedBookReservationService.findOnePrevThanTime).toBeCalledWith(
        mockUserId,
        expect.any(moment),
      );
      expect(mockedBookReservationService.create).toBeCalledWith(
        mockBookReservationParam,
      );
    });

    test('api book borrow Book not exists', async () => {
      mockedBookService.findById.mockResolvedValue(null);

      await request(App)
        .post(`/api/books/${mockBookId}/borrow`)
        .send(mockBookReservationParam)
        .expect(NOT_FOUND_ERROR);
    });

    test('api book borrow Book Reservation exists', async () => {
      mockedBookService.findById.mockResolvedValue(mockBook as Book);
      mockedBookReservationService.findByBookId.mockResolvedValue(
        mockBookReservation as any,
      );

      await request(App)
        .post(`/api/books/${mockBookId}/borrow`)
        .send(mockBookReservationParam)
        .expect(CONFLICT_ERROR);
      expect(mockedBookService.findById).toBeCalledWith(mockBookId);
      expect(mockedBookReservationService.findByBookId).toBeCalledWith(
        mockBookId,
      );
    });

    test('api book borrow Book penalty or delayedReservation exists', async () => {
      mockedBookService.findById.mockResolvedValue(mockBook as Book);
      mockedBookReservationService.findByBookId.mockResolvedValue(null);
      mockedReservationPenaltyService.findOneLaterThanTime.mockResolvedValue(
        null,
      );
      mockedBookReservationService.findOnePrevThanTime.mockResolvedValue(
        mockReservationPenalty as any,
      );

      await request(App)
        .post(`/api/books/${mockBookId}/borrow`)
        .send(mockBookReservationParam)
        .expect(CLIENT_ERROR);
      expect(mockedBookService.findById).toBeCalledWith(mockBookId);
      expect(mockedBookReservationService.findByBookId).toBeCalledWith(
        mockBookId,
      );
      expect(
        mockedReservationPenaltyService.findOneLaterThanTime,
      ).toBeCalledWith(mockUserId, expect.any(moment));
      expect(mockedBookReservationService.findOnePrevThanTime).toBeCalledWith(
        mockUserId,
        expect.any(moment),
      );
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
  });

  describe('api book return', () => {
    test('api book not delayed return', async () => {
      mockedBookReservationService.findByBookId.mockResolvedValue(
        mockBookReservation as any,
      );
      mockedBookReservationService.destroyById.mockResolvedValue(1);

      const response = await request(App)
        .post(`/api/books/${mockBookId}/return`)
        .send(mockBookReservationParam)
        .expect(SUCCESS_CODE);
      expect(response.body.result).toEqual({ destroyedCount: 1 });
      expect(mockedBookReservationService.findByBookId).toBeCalledWith(
        mockBookId,
      );
      expect(mockedReservationPenaltyService.create).not.toHaveBeenCalled();
      expect(mockedBookReservationService.destroyById).toBeCalledWith(
        mockUserId,
        mockBookId,
        mockTransactionOptions,
      );
    });

    test('api book delayed return', async () => {
      mockedBookReservationService.findByBookId.mockResolvedValue(
        mockDelayedBookReservation as any,
      );
      mockedReservationPenaltyService.create.mockResolvedValue(
        mockDelayedBookReservation as any,
      );
      mockedBookReservationService.destroyById.mockResolvedValue(1);

      await request(App)
        .post(`/api/books/${mockBookId}/return`)
        .send(mockDelayedBookReservationParam)
        .expect(SUCCESS_CODE);
      expect(mockedBookReservationService.findByBookId).toBeCalledWith(
        mockBookId,
      );
      // TODO : endAt 을 동일하게 가져가려고 moment를 모킹하고 싶은데 모듈 자체를 모킹하니 에러가 난다.
      // expect(mockedReservationPenaltyService.create).toBeCalledWith(mockDelayedBookReservationParam);
      expect(mockedReservationPenaltyService.create).toHaveBeenCalled();
      expect(mockedBookReservationService.destroyById).toBeCalledWith(
        mockUserId,
        mockBookId,
        mockTransactionOptions,
      );
    });

    test('api book return transaction error', async () => {
      mockedBookReservationService.findByBookId.mockResolvedValue(
        mockDelayedBookReservation as any,
      );
      mockedReservationPenaltyService.create.mockImplementation(() => {
        throw new Error();
      });

      await request(App)
        .post(`/api/books/${mockBookId}/return`)
        .send(mockBookReservationParam)
        .expect(SERVER_ERROR);
      expect(mockedBookReservationService.findByBookId).toBeCalledWith(
        mockBookId,
      );
      expect(mockedReservationPenaltyService.create).toBeCalled();
      expect(mockedBookReservationService.destroyById).not.toHaveBeenCalled();
    });

    test('api book return another person borrowed reservation', async () => {
      mockedBookReservationService.findByBookId.mockResolvedValue(
        mockAnotherPersonBorrowedBookReservation as any,
      );

      await request(App)
        .post(`/api/books/${mockBookId}/return`)
        .send(mockBookReservationParam)
        .expect(NOT_AUTHORIZED_ERROR);
      expect(mockedBookReservationService.findByBookId).toBeCalledWith(
        mockBookId,
      );
      expect(mockedBookReservationService.destroyById).not.toHaveBeenCalled();
    });

    test('api book return Not found', async () => {
      mockedBookReservationService.findByBookId.mockResolvedValue(null);

      await request(App)
        .post(`/api/books/${mockBookId}/return`)
        .send(mockBookReservationParam)
        .expect(NOT_FOUND_ERROR);
      expect(mockedBookReservationService.findByBookId).toBeCalledWith(
        mockBookId,
      );
    });

    test('api book return Param Validation fail', async () => {
      await request(App)
        .post(`/api/books/no_number/return`)
        .expect(PARAM_VALIDATION_ERROR);
    });
  });

  describe('api book checkAvailableToBorrow', () => {
    test('api book checkAvailableToBorrow availableToBorrow True', async () => {
      mockedReservationPenaltyService.findOneLaterThanTime.mockResolvedValue(
        null,
      );
      mockedBookReservationService.findOnePrevThanTime.mockResolvedValue(null);

      const response = await request(App)
        .post(`/api/books/check_available_to_borrow`)
        .send(mockBookReservationParam)
        .expect(SUCCESS_CODE);
      expect(response.body.result.availableToBorrow).toBeTruthy();
      expect(
        mockedReservationPenaltyService.findOneLaterThanTime,
      ).toBeCalledWith(mockUserId, expect.any(moment));
      expect(mockedBookReservationService.findOnePrevThanTime).toBeCalledWith(
        mockUserId,
        expect.any(moment),
      );
    });

    test('api book delayed checkAvailableToBorrow availableToBorrow false due to reservationPenalty', async () => {
      mockedReservationPenaltyService.findOneLaterThanTime.mockResolvedValue(
        mockReservationPenalty as any,
      );
      mockedBookReservationService.findOnePrevThanTime.mockResolvedValue(null);

      const response = await request(App)
        .post(`/api/books/check_available_to_borrow`)
        .send(mockDelayedBookReservationParam)
        .expect(SUCCESS_CODE);
      expect(response.body.result.availableToBorrow).toBeFalsy();
      expect(
        mockedReservationPenaltyService.findOneLaterThanTime,
      ).toBeCalledWith(mockUserId, expect.any(moment));
      expect(mockedBookReservationService.findOnePrevThanTime).toBeCalledWith(
        mockUserId,
        expect.any(moment),
      );
    });

    test('api book delayed checkAvailableToBorrow availableToBorrow false due to delayedBookReservation', async () => {
      mockedReservationPenaltyService.findOneLaterThanTime.mockResolvedValue(
        null,
      );
      mockedBookReservationService.findOnePrevThanTime.mockResolvedValue(
        mockDelayedBookReservation as any,
      );

      const response = await request(App)
        .post(`/api/books/check_available_to_borrow`)
        .send(mockDelayedBookReservationParam)
        .expect(SUCCESS_CODE);
      expect(response.body.result.availableToBorrow).toBeFalsy();
      expect(
        mockedReservationPenaltyService.findOneLaterThanTime,
      ).toBeCalledWith(mockUserId, expect.any(moment));
      expect(mockedBookReservationService.findOnePrevThanTime).toBeCalledWith(
        mockUserId,
        expect.any(moment),
      );
    });

    test('api book delayed checkAvailableToBorrow availableToBorrow false due to both of them', async () => {
      mockedReservationPenaltyService.findOneLaterThanTime.mockResolvedValue(
        mockReservationPenalty as any,
      );
      mockedBookReservationService.findOnePrevThanTime.mockResolvedValue(
        mockDelayedBookReservation as any,
      );

      const response = await request(App)
        .post(`/api/books/check_available_to_borrow`)
        .send(mockDelayedBookReservationParam)
        .expect(SUCCESS_CODE);
      expect(response.body.result.availableToBorrow).toBeFalsy();
      expect(
        mockedReservationPenaltyService.findOneLaterThanTime,
      ).toBeCalledWith(mockUserId, expect.any(moment));
      expect(mockedBookReservationService.findOnePrevThanTime).toBeCalledWith(
        mockUserId,
        expect.any(moment),
      );
    });
  });
});
