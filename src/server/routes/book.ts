import db from 'database/models';
import { NextFunction, Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import moment = require('moment');
import { assertAll, isDate, isNumeric, presence } from 'property-validator';
import { isAuthenticated } from 'server/passport';
import {
  CLIENT_ERROR,
  CONFLICT_ERROR,
  CREATED_CODE,
  NOT_AUTHORIZED_ERROR,
  NOT_FOUND_ERROR,
  SERVER_ERROR,
  SUCCESS_CODE,
} from 'server/routes/constants';
import bookReservationService from 'server/service/bookReservationService';
import bookService from 'server/service/bookService';
import reservationPenaltyService from 'server/service/reservationPenaltyService';
import { makeFailResponse, makeSuccessResponse } from 'server/utils/result';

export class BookRouter {
  constructor() {
    if (BookRouter.instance) {
      return BookRouter.instance;
    }
    BookRouter.instance = this;
    this.router = Router();
    this.init();
  }

  public static instance: BookRouter;
  public router: Router;

  public async createOne(req: Request, res: Response, next: NextFunction) {
    assertAll(req, [presence('name'), presence('desc')]);
    const { name, desc } = req.body;

    const book = await bookService.create({ name, desc });
    return makeSuccessResponse(res, CREATED_CODE, book, '책 생성 완료.');
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    const books = await bookService.findAll();

    return makeSuccessResponse(res, SUCCESS_CODE, books, '다 가져옴.');
  }

  public async getOne(req: Request, res: Response, next: NextFunction) {
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
  }

  public async deleteOne(req: Request, res: Response, next: NextFunction) {
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
  }

  public async borrow(req: Request, res: Response, next: NextFunction) {
    assertAll(req, [isNumeric('id'), isDate('endAt')]);
    const bookId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const { endAt } = req.body;
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

    const currentTime = moment();
    const reservationPenalty = await reservationPenaltyService.findOneLaterThanTime(
      userId,
      currentTime,
    );

    const delayedBookReservation = await bookReservationService.findOnePrevThanTime(
      userId,
      currentTime,
    );

    if (reservationPenalty || delayedBookReservation) {
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
  }

  public async return(req: Request, res: Response, next: NextFunction) {
    assertAll(req, [isNumeric('id')]);
    const bookId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const bookReservation = await bookReservationService.findByBookId(bookId);
    if (!bookReservation) {
      return makeFailResponse(res, NOT_FOUND_ERROR, '그런 예약 존재하지 않음');
    } else if (bookReservation.userId !== userId) {
      return makeFailResponse(res, NOT_AUTHORIZED_ERROR, '예약 한 사람이 아님');
    }

    const currentTime = moment();
    const diff = currentTime.diff(moment(bookReservation.endAt));
    db.sequelize.transaction(async (t) => {
      let createdReservationPenalty;
      if (diff > 0) {
        createdReservationPenalty = await reservationPenaltyService.create({
          userId,
          bookReservationId: bookReservation.id,
          endAt: currentTime.add(diff * 2),
        }, {transaction: t});
      }

      const destroyedCount = await bookReservationService.destroyById(
        userId,
        bookId,
        {transaction: t});

      if (destroyedCount) {
        return makeSuccessResponse(
          res,
          SUCCESS_CODE,
          { destroyedCount, createdReservationPenalty },
          '반납 성공',
        );
      } else {
        return makeFailResponse(res, SERVER_ERROR, '반납에 실패함');
      }
    }).catch((error: Error) => {
      return makeFailResponse(res, SERVER_ERROR, `반납에 실패함 ${error.message}`);
      },
    );
  }

  public async checkAvailableToBorrow(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const userId = req.user.id;
    const currentTime = moment();
    let moreLaterEndAt;
    const reservationPenalty = await reservationPenaltyService.findOneLaterThanTime(
      userId,
      currentTime,
    );
    if (reservationPenalty) {
      moreLaterEndAt = moment(reservationPenalty.endAt);
    }

    const delayedBookReservation = await bookReservationService.findOnePrevThanTime(
      userId,
      currentTime,
    );
    if (delayedBookReservation) {
      const delayedBookReservationEndAt = moment(delayedBookReservation.endAt);
      const diff = currentTime.diff(delayedBookReservationEndAt);
      const willPenaltyTime = currentTime.add(diff * 2);

      moreLaterEndAt =
        !!moreLaterEndAt && moreLaterEndAt > willPenaltyTime
          ? moreLaterEndAt
          : willPenaltyTime;
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
        reservationPenaltyEndAt: moreLaterEndAt.toISOString(true),
        availableToBorrow: false,
      },
      '확인 완료',
    );
  }

  public init() {
    this.router.post('/', asyncHandler(this.createOne));
    this.router.get('/', asyncHandler(this.getAll));
    this.router.get('/:id', asyncHandler(this.getOne));
    this.router.delete('/:id', asyncHandler(this.deleteOne));

    this.router.post('/:id/borrow', isAuthenticated, asyncHandler(this.borrow));
    this.router.post('/:id/return', isAuthenticated, asyncHandler(this.return));
    this.router.post(
      '/check_available_to_borrow',
      isAuthenticated,
      asyncHandler(this.checkAvailableToBorrow),
    );
  }
}

const bookRoutes = new BookRouter();

export default bookRoutes.router;
