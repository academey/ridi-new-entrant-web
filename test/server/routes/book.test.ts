import { Book } from 'database/models/Book';
import { NextFunction, Request, Response } from 'express';
import App from 'server/App';
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
import request from 'supertest';
import {
  mockBook,
  mockBookId,
  mockBookList,
  mockBookParam,
  mockBookReservation,
  mockBookReservationCreateParam,
  mockBookReservationParam,
  mockDelayedBookReservation,
  mockLateReturnedBookReservation,
  mockLaterPenaltyEndAt,
  mockPenaltyEndAt,
  mockUser,
  mockUserId,
} from '../constants';

jest.mock('database/models');
jest.mock('server/passport');
jest.mock('server/service/bookReservationService');
jest.mock('server/service/bookService');

// TODO: 인증이 필요한 애들은 따로 테스트해봐야 될 것 같다.

const mockIsAuthenticated = isAuthenticated as jest.Mock;
const mockedBookService = bookService as jest.Mocked<typeof bookService>;
const mockedBookReservationService = bookReservationService as jest.Mocked<
  typeof bookReservationService
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
      mockedBookReservationService.findLateReturnedOne.mockResolvedValue(null);
      mockedBookReservationService.findDelayedOne.mockResolvedValue(null);
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
      expect(mockedBookReservationService.findLateReturnedOne).toBeCalledWith(
        mockUserId,
      );
      expect(mockedBookReservationService.findDelayedOne).toBeCalledWith(
        mockUserId,
      );
      expect(mockedBookReservationService.create).toBeCalledWith(
        mockBookReservationCreateParam,
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
      mockedBookReservationService.findLateReturnedOne.mockResolvedValue(null);
      mockedBookReservationService.findDelayedOne.mockResolvedValue(
        mockDelayedBookReservation as any,
      );

      await request(App)
        .post(`/api/books/${mockBookId}/borrow`)
        .send(mockBookReservationParam)
        .expect(CLIENT_ERROR);
      expect(mockedBookService.findById).toBeCalledWith(mockBookId);
      expect(mockedBookReservationService.findByBookId).toBeCalledWith(
        mockBookId,
      );
      expect(mockedBookReservationService.findLateReturnedOne).toBeCalledWith(
        mockUserId,
      );
      expect(mockedBookReservationService.findDelayedOne).toBeCalledWith(
        mockUserId,
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
    test('api book return', async () => {
      mockedBookReservationService.findByBookIdAndUserId.mockResolvedValue(
        mockBookReservation as any,
      );
      mockedBookReservationService.destroyById.mockResolvedValue(1);

      const response = await request(App)
        .post(`/api/books/${mockBookId}/return`)
        .send(mockBookReservationParam)
        .expect(SUCCESS_CODE);
      expect(response.body.result).toEqual({ destroyedCount: 1 });
      expect(mockedBookReservationService.findByBookIdAndUserId).toBeCalledWith(
        mockBookId,
        mockUserId,
      );
      expect(mockedBookReservationService.destroyById).toBeCalledWith(
        mockUserId,
        mockBookId,
      );
    });

    test('api book return Not found', async () => {
      mockedBookReservationService.findByBookIdAndUserId.mockResolvedValue(
        null,
      );

      await request(App)
        .post(`/api/books/${mockBookId}/return`)
        .send(mockBookReservationParam)
        .expect(NOT_FOUND_ERROR);
      expect(mockedBookReservationService.findByBookIdAndUserId).toBeCalledWith(
        mockBookId,
        mockUserId,
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
      mockedBookReservationService.findLateReturnedOne.mockResolvedValue(null);
      mockedBookReservationService.findDelayedOne.mockResolvedValue(null);

      const response = await request(App)
        .post(`/api/books/check_available_to_borrow`)
        .expect(SUCCESS_CODE);
      expect(response.body.result.availableToBorrow).toBeTruthy();
      expect(mockedBookReservationService.findLateReturnedOne).toBeCalledWith(
        mockUserId,
      );
      expect(mockedBookReservationService.findDelayedOne).toBeCalledWith(
        mockUserId,
      );
    });

    test(
      'api book delayed checkAvailableToBorrow availableToBorrow false ' +
        'due to lateReturnedBookReservation',
      async () => {
        mockedBookReservationService.findLateReturnedOne.mockResolvedValue(
          mockLateReturnedBookReservation as any,
        );
        mockedBookReservationService.findDelayedOne.mockResolvedValue(null);

        const response = await request(App)
          .post(`/api/books/check_available_to_borrow`)
          .expect(SUCCESS_CODE);
        expect(response.body.result.availableToBorrow).toBeFalsy();
        expect(response.body.result.reservationPenaltyEndAt).toEqual(
          mockLaterPenaltyEndAt,
        );
        expect(mockedBookReservationService.findLateReturnedOne).toBeCalledWith(
          mockUserId,
        );
        expect(mockedBookReservationService.findDelayedOne).toBeCalledWith(
          mockUserId,
        );
      },
    );

    test('api book delayed checkAvailableToBorrow availableToBorrow false due to delayedBookReservation', async () => {
      mockedBookReservationService.findLateReturnedOne.mockResolvedValue(null);
      mockedBookReservationService.findDelayedOne.mockResolvedValue(
        mockDelayedBookReservation as any,
      );

      const response = await request(App)
        .post(`/api/books/check_available_to_borrow`)
        .expect(SUCCESS_CODE);
      expect(response.body.result.availableToBorrow).toBeFalsy();
      expect(response.body.result.reservationPenaltyEndAt).toEqual(
        mockPenaltyEndAt,
      );
      expect(mockedBookReservationService.findLateReturnedOne).toBeCalledWith(
        mockUserId,
      );
      expect(mockedBookReservationService.findDelayedOne).toBeCalledWith(
        mockUserId,
      );
    });

    test('api book delayed checkAvailableToBorrow availableToBorrow false due to both of them', async () => {
      mockedBookReservationService.findLateReturnedOne.mockResolvedValue(
        mockLateReturnedBookReservation as any,
      );
      mockedBookReservationService.findDelayedOne.mockResolvedValue(
        mockDelayedBookReservation as any,
      );

      const response = await request(App)
        .post(`/api/books/check_available_to_borrow`)
        .expect(SUCCESS_CODE);
      expect(response.body.result.availableToBorrow).toBeFalsy();
      expect(response.body.result.reservationPenaltyEndAt).toEqual(
        mockLaterPenaltyEndAt,
      );
      expect(mockedBookReservationService.findLateReturnedOne).toBeCalledWith(
        mockUserId,
      );
      expect(mockedBookReservationService.findDelayedOne).toBeCalledWith(
        mockUserId,
      );
    });
  });
});
