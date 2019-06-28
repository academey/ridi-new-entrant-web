import { Author } from 'database/models/Author';
import { NextFunction, Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { assertAll, isNumeric, presence } from 'property-validator';
import { makeFailResponse, makeSuccessResponse } from 'server/utils/result';

export class AuthorRouter {
  constructor() {
    this.router = Router();
    this.init();
  }
  public router: Router;

  public async createOne(req: Request, res: Response, next: NextFunction) {
    assertAll(req, [presence('name'), presence('desc')]);
    const { name, desc } = req.body;
    const author = await Author.create({
      name,
      desc,
    });

    res.status(200).send(makeSuccessResponse(author, '작가 생성 완료.'));
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    const authors: Author[] = await Author.findAll();

    res.status(200).send(makeSuccessResponse(authors, '다 가져옴'));
  }

  public async getOne(req: Request, res: Response, next: NextFunction) {
    assertAll(req, [isNumeric('id')]);
    const query = parseInt(req.params.id, 10);
    const author = await Author.findByPk(query);

    if (author) {
      res.status(200).send(makeSuccessResponse(author, '하나 가져옴'));
    } else {
      res.status(404).send(makeFailResponse('그런 아이디를 가진 작가는 없음'));
    }
  }

  public async deleteOne(req: Request, res: Response, next: NextFunction) {
    assertAll(req, [isNumeric('id')]);
    const query = parseInt(req.params.id, 10);
    try {
      const destroyedCount = await Author.destroy({
        where: {
          id: query,
        },
      });
      if (destroyedCount === 0) {
        return res
          .status(404)
          .send(makeFailResponse('그런 아이디를 가진 작가는 없음'));
      }

      res
        .status(200)
        .send(makeSuccessResponse({ destroyedCount }, '제거 성공'));
    } catch (err) {
      res.status(500).send(makeFailResponse('뭔가 서버 에러 남'));
    }
  }

  public init() {
    this.router.post('/', asyncHandler(this.createOne));
    this.router.get('/', asyncHandler(this.getAll));
    this.router.get('/:id', asyncHandler(this.getOne));
    this.router.delete('/:id', asyncHandler(this.deleteOne));
  }
}

const authorRoutes = new AuthorRouter();
authorRoutes.init();

export default authorRoutes.router;
