import { Book } from 'database/models/Book';
import { BookReservation } from 'database/models/BookReservation';
import { ReservationPenalty } from 'database/models/ReservationPenalty';
import { NextFunction, Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import moment = require('moment');
import { assertAll, isDate, isNumeric, presence } from 'property-validator';
import { Op } from 'sequelize';
import { isAuthenticated } from 'server/passport';
import {
  CONFLICT_ERROR,
  CREATED_CODE,
  NOT_AUTHORIZED_ERROR,
  NOT_FOUND_ERROR,
  SERVER_ERROR,
  SUCCESS_CODE,
} from 'server/routes/constants';
import { makeFailResponse, makeSuccessResponse } from 'server/utils/result';

export class BookRouter {
  constructor() {
    this.router = Router();
    this.init();
  }
  public router: Router;

  public async createOne(req: Request, res: Response, next: NextFunction) {
    assertAll(req, [presence('name'), presence('desc')]);
    const { name, desc } = req.body;
    const book = await Book.create({
      name,
      desc,
    });
    return makeSuccessResponse(res, CREATED_CODE, book, '책 생성 완료.');
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    const books: Book[] = await Book.findAll({
      include: [BookReservation],
      order: ['id', 'DESC'],
    });

    return makeSuccessResponse(res, SUCCESS_CODE, books, '다 가져옴.');
  }

  public async getOne(req: Request, res: Response, next: NextFunction) {
    assertAll(req, [isNumeric('id')]);
    const bookId = parseInt(req.params.id, 10);
    const book = await Book.findByPk(bookId);

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
    const id = parseInt(req.params.id, 10);
    try {
      const destroyedCount = await Book.destroy({
        where: {
          id,
        },
      });
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

  public async borrow(req: any, res: Response, next: NextFunction) {
    assertAll(req, [isNumeric('id'), isDate('endAt')]);
    const bookId = parseInt(req.params.id, 10);
    const { endAt } = req.body;
    const userId = req.user.id;
    const book = await Book.findByPk(bookId);
    if (!book) {
      return makeFailResponse(
        res,
        NOT_FOUND_ERROR,
        '그런 아이디를 가진 책은 없음',
      );
    }

    const bookReservation = await BookReservation.findOne({
      where: {
        bookId,
      },
    });

    if (bookReservation) {
      return makeFailResponse(
        res,
        CONFLICT_ERROR,
        '이미 누군아에 의해 빌려졌습니다.',
      );
    }
    const createdBookReservation = await BookReservation.create({
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

  public async return(req: any, res: Response, next: NextFunction) {
    assertAll(req, [isNumeric('id')]);
    const bookId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const bookReservation = await BookReservation.findOne({
      where: {
        bookId,
      },
    });
    if (!bookReservation) {
      return makeFailResponse(res, NOT_FOUND_ERROR, '그런 예약 존재하지 않음');
    } else if (bookReservation.userId !== userId) {
      return makeFailResponse(res, NOT_AUTHORIZED_ERROR, '예약 한 사람이 아님');
    }

    const diff = moment().diff(moment(bookReservation.endAt));
    let createdReservationPenalty;
    if (diff > 0) {
      createdReservationPenalty = await ReservationPenalty.create({
        userId,
        bookReservationId: bookReservation.id,
        endAt: moment().add(diff),
      });
    }
    const destroyedCount = await BookReservation.destroy({
      where: {
        userId,
        bookId,
      },
    });

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
  }

  public async checkAvailableToBorrow(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const userId = req.user.id;
    const currentTime = moment();
    let availableToBorrow = true;
    const reservationPenalty: ReservationPenalty = await ReservationPenalty.findOne(
      {
        where: {
          userId,
          endAt: {
            [Op.gt]: currentTime, // endAt > currentTime Query
          },
        },
        order: [['end_at', 'DESC']],
      },
    );
    if (!reservationPenalty) {
      return makeSuccessResponse(
        res,
        SUCCESS_CODE,
        { availableToBorrow },
        '확인 완료',
      );
    }

    const reservationPenaltyEndAt = moment(reservationPenalty.endAt);
    availableToBorrow =
      currentTime.diff(reservationPenaltyEndAt) > 0 ? true : false;

    return makeSuccessResponse(
      res,
      SUCCESS_CODE,
      {
        reservationPenaltyEndAt: reservationPenaltyEndAt.toISOString(true),
        availableToBorrow,
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
