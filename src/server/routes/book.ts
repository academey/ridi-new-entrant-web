import { Book } from 'database/models/Book';
import { BookReservation } from 'database/models/BookReservation';
import { NextFunction, Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { assertAll, isDate, isNumeric, presence } from 'property-validator';
import { isAuthenticated } from 'server/passport';
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

    res.status(201).send(makeSuccessResponse(book, '책 생성 완료.'));
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    const books: Book[] = await Book.findAll({
      include: [BookReservation],
      order: ['id', 'DESC'],
    });

    res.status(200).send(makeSuccessResponse(books, '다 가져옴'));
  }

  public async getOne(req: Request, res: Response, next: NextFunction) {
    assertAll(req, [isNumeric('id')]);
    const bookId = parseInt(req.params.id, 10);
    const book = await Book.findByPk(bookId);

    if (book) {
      res.status(200).send(makeSuccessResponse(book, '하나 가져옴'));
    } else {
      res.status(404).send(makeFailResponse('그런 아이디를 가진 책은 없음'));
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
        return res
          .status(404)
          .send(makeFailResponse('그런 아이디를 가진 책은 없음'));
      }

      res
        .status(200)
        .send(makeSuccessResponse({ destroyedCount }, '제거 성공'));
    } catch (err) {
      res.status(500).send(makeFailResponse('뭔가 서버 에러 남'));
    }
  }

  public async borrow(req: any, res: Response, next: NextFunction) {
    assertAll(req, [isNumeric('id'), isDate('endAt')]);
    const bookId = parseInt(req.params.id, 10);
    const { endAt } = req.body;
    const userId = req.user.id;
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).send(makeFailResponse('빌리려는 책이 없습니다.'));
    }

    const bookReservation = await BookReservation.findOne({
      where: {
        bookId,
      },
    });

    if (bookReservation) {
      return res
        .status(409)
        .send(
          makeFailResponse(
            `이미 ${bookReservation.userId}에 의해 빌려졌습니다.`,
          ),
        );
    }

    const createdBookReservation = await BookReservation.create({
      userId,
      bookId,
      endAt,
    });
    if (createdBookReservation) {
      res
        .status(200)
        .send(makeSuccessResponse(createdBookReservation, '빌리기 성공'));
    } else {
      res.status(500).send(makeFailResponse('서버 오류로 안 빌려졌음'));
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
      return res.status(404).send(makeFailResponse('그런 예약 존재하지 않음'));
    } else if (bookReservation.userId !== userId) {
      return res.status(401).send(makeFailResponse('예약 한 사람이 아님'));
    }

    const destroyedCount = await BookReservation.destroy({
      where: {
        userId,
        bookId,
      },
    });

    if (destroyedCount) {
      res
        .status(200)
        .send(makeSuccessResponse({ destroyedCount }, '반납 성공'));
    } else {
      res.status(404).send(makeFailResponse('반납에 실패함'));
    }
  }

  public init() {
    this.router.post('/', asyncHandler(this.createOne));
    this.router.get('/', asyncHandler(this.getAll));
    this.router.get('/:id', asyncHandler(this.getOne));
    this.router.delete('/:id', asyncHandler(this.deleteOne));

    this.router.post('/:id/borrow', isAuthenticated, asyncHandler(this.borrow));
    this.router.post('/:id/return', isAuthenticated, asyncHandler(this.return));
  }
}

const bookRoutes = new BookRouter();
bookRoutes.init();

export default bookRoutes.router;
