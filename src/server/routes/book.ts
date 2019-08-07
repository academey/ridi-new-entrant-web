import { NextFunction, Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import moment = require('moment');
import { assertAll, isDate, isNumeric, presence } from 'property-validator';
import { isAuthenticated } from 'server/passport';
import {
  CLIENT_ERROR,
  CONFLICT_ERROR,
  CREATED_CODE,
  NOT_FOUND_ERROR,
  SERVER_ERROR,
  SUCCESS_CODE,
} from 'server/routes/constants';
import bookReservationService from 'server/service/bookReservationService';
import bookService from 'server/service/bookService';
import { makeFailResponse, makeSuccessResponse } from 'server/utils/result';

const createOne = async (req: Request, res: Response, next: NextFunction) => {
  assertAll(req, [presence('name'), presence('desc')]);
  const { name, desc } = req.body;

  const book = await bookService.create({ name, desc });
  return makeSuccessResponse(res, CREATED_CODE, book, '책 생성 완료.');
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  const books = await bookService.findAll();

  return makeSuccessResponse(res, SUCCESS_CODE, books, '다 가져옴.');
};

const getOne = async (req: Request, res: Response, next: NextFunction) => {
  assertAll(req, [isNumeric('id')]);
  const bookId = parseInt(req.params.id, 10);
  const book = await bookService.findById(bookId);

  if (book) {
    return makeSuccessResponse(res, SUCCESS_CODE, book, '하나 가져옴.');
  } else {
    return makeFailResponse(
      res,
      NOT_FOUND_ERROR,
      '그런 아이디를 가진 책은 없음',
    );
  }
};

const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
  assertAll(req, [isNumeric('id')]);
  const bookId = parseInt(req.params.id, 10);
  try {
    const destroyedCount = await bookService.destroyById(bookId);
    if (destroyedCount === 0) {
      return makeFailResponse(
        res,
        NOT_FOUND_ERROR,
        '그런 아이디를 가진 책은 없음',
      );
    }

    return makeSuccessResponse(
      res,
      SUCCESS_CODE,
      { destroyedCount },
      '제거 성공.',
    );
  } catch (err) {
    return makeFailResponse(res, SERVER_ERROR, '뭔가 서버 에러 남');
  }
};

const borrow = async (req: Request, res: Response, next: NextFunction) => {
  assertAll(req, [isNumeric('duration'), presence('unit')]);
  const bookId = parseInt(req.params.id, 10);
  const userId = req.user.id;
  const { duration, unit } = req.body;
  const endAt = moment().add(duration, unit);

  const book = await bookService.findById(bookId);
  if (!book) {
    return makeFailResponse(
      res,
      NOT_FOUND_ERROR,
      '그런 아이디를 가진 책은 없음',
    );
  }

  const bookReservation = await bookReservationService.findByBookId(bookId);
  if (bookReservation) {
    return makeFailResponse(
      res,
      CONFLICT_ERROR,
      '이미 누군가에 의해 빌려졌습니다.',
    );
  }

  const lateReturnedBookReservation = await bookReservationService.findLateReturnedOne(userId);
  const delayedBookReservation = await bookReservationService.findDelayedOne(userId);

  if (lateReturnedBookReservation || delayedBookReservation) {
    return makeFailResponse(
      res,
      CLIENT_ERROR,
      '연체 중이거나 제 시간에 반납을 안 해서 못 빌립니다.',
    );
  }

  const createdBookReservation = await bookReservationService.create({
    userId,
    bookId,
    endAt,
  });
  if (createdBookReservation) {
    return makeSuccessResponse(
      res,
      SUCCESS_CODE,
      createdBookReservation,
      '빌리기 성공',
    );
  } else {
    return makeFailResponse(res, SERVER_ERROR, '뭔가 서버 에러 남');
  }
};

const returnBook = async (req: Request, res: Response, next: NextFunction) => {
  assertAll(req, [isNumeric('id')]);
  const bookId = parseInt(req.params.id, 10);
  const userId = req.user.id;

  const bookReservation = await bookReservationService.findByBookIdAndUserId(bookId, userId);
  if (!bookReservation) {
    return makeFailResponse(res, NOT_FOUND_ERROR, '그런 예약 존재하지 않음');
  }

  const destroyedCount = await bookReservationService.destroyById(
    userId,
    bookId);

  if (destroyedCount) {
    return makeSuccessResponse(
      res,
      SUCCESS_CODE,
      { destroyedCount },
      '반납 성공',
    );
  } else {
    return makeFailResponse(res, SERVER_ERROR, '반납에 실패함');
  }
};

const checkAvailableToBorrow = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user.id;
  let moreLaterEndAt;

  const lateReturnedBookReservation = await bookReservationService.findLateReturnedOne(userId);
  if (lateReturnedBookReservation) {
    moreLaterEndAt = lateReturnedBookReservation.get('penalty_end_at');
  }

  const delayedBookReservation = await bookReservationService.findDelayedOne(userId);
  if (delayedBookReservation) {
    const delayedBookReservationPenaltyEndAt = delayedBookReservation.get('penalty_end_at');

    moreLaterEndAt =
      !!moreLaterEndAt && (moreLaterEndAt > delayedBookReservationPenaltyEndAt)
        ? moreLaterEndAt
        : delayedBookReservationPenaltyEndAt;
  }

  if (!moreLaterEndAt) {
    return makeSuccessResponse(
      res,
      SUCCESS_CODE,
      { availableToBorrow: true },
      '확인 완료',
    );
  }

  return makeSuccessResponse(
    res,
    SUCCESS_CODE,
    {
      reservationPenaltyEndAt: moreLaterEndAt,
      availableToBorrow: false,
    },
    '확인 완료',
  );
};

const router = Router();

router.post('/', asyncHandler(createOne));
router.get('/', asyncHandler(getAll));
router.get('/:id', asyncHandler(getOne));
router.delete('/:id', asyncHandler(deleteOne));
router.post('/:id/borrow', isAuthenticated, asyncHandler(borrow));
router.post('/:id/return', isAuthenticated, asyncHandler(returnBook));
router.post(
  '/check_available_to_borrow',
  isAuthenticated,
  asyncHandler(checkAvailableToBorrow),
);

export default router;
