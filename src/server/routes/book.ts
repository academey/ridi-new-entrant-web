import { NextFunction, Request, Response, Router } from 'express';
import { Book } from '../../database/models/Book';
import { BookReservation } from '../../database/models/BookReservation';
import { isAuthenticated } from '../passport';
import {
  makeFailResponse,
  makeResponse,
  makeSuccessResponse,
  RESPONSE_STATUS,
} from '../utils/result';

export class BookRouter {
  constructor() {
    this.router = Router();
    this.init();
  }
  public router: Router;

  public async createOne(req: Request, res: Response, next: NextFunction) {
    const { name, desc } = req.body;
    const book = await Book.create({
      name,
      desc,
    });

    res
      .status(200)
      .send(makeResponse(RESPONSE_STATUS.SUCCESS, { book }, '책 생성 완료.'));
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    const books = await Book.findAll({ include: [BookReservation] });
    res.status(200).send(makeSuccessResponse({ test: 3, books }, '다 가져옴'));
  }

  public async getOne(req: Request, res: Response, next: NextFunction) {
    const query = parseInt(req.params.id, 10);
    const book = await Book.findByPk(query);
    if (book) {
      res.status(200).send(makeSuccessResponse({ book }, '하나 가져옴'));
    } else {
      res.status(404).send(makeFailResponse('그런 아이디를 가진 책은 없음'));
    }
  }

  public async deleteOne(req: Request, res: Response, next: NextFunction) {
    const query = parseInt(req.params.id, 10);
    try {
      const destroyedCount = await Book.destroy({
        where: {
          id: query,
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
    const { bookId, endAt } = req.body;
    const userId = req.User.id;
    const bookReservation = await BookReservation.findOne({
      where: {
        bookId,
      },
    });
    if (bookReservation) {
      return res
        .status(404)
        .send(
          makeFailResponse(`Already reserved by ${bookReservation.userId}`),
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
        .send(makeSuccessResponse({ createdBookReservation }, '빌리기 성공'));
    } else {
      res.status(404).send(makeFailResponse('그런 아이디를 가진 책은 없음'));
    }
  }

  public async return(req: any, res: Response, next: NextFunction) {
    const { bookId } = req.body;
    const userId = req.User.id;
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

    const deletedBookReservation = await BookReservation.destroy({
      where: {
        userId,
        bookId,
      },
    });

    if (deletedBookReservation) {
      res
        .status(200)
        .send(makeSuccessResponse({ deletedBookReservation }, '반납 성공'));
    } else {
      res.status(404).send(makeFailResponse('반납에 실패함'));
    }
  }

  public init() {
    this.router.post('/', this.createOne);
    this.router.get('/', this.getAll);
    this.router.get('/:id', this.getOne);
    this.router.delete('/:id', this.deleteOne);

    this.router.post('/borrow', isAuthenticated, this.borrow);
    this.router.post('/return', isAuthenticated, this.return);
  }
}

const bookRoutes = new BookRouter();
bookRoutes.init();

export default bookRoutes.router;
