import { NextFunction, Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { assertAll, isNumeric, presence } from 'property-validator';
import {
  CREATED_CODE,
  NOT_FOUND_ERROR,
  SERVER_ERROR,
  SUCCESS_CODE,
} from 'server/routes/constants';
import authorService from 'server/service/authorService';
import { makeFailResponse, makeSuccessResponse } from 'server/utils/result';

const createOne = async (req: Request, res: Response, next: NextFunction) => {
  assertAll(req, [presence('name'), presence('desc')]);
  const { name, desc } = req.body;
  const author = await authorService.create({name, desc});

  return makeSuccessResponse(res, CREATED_CODE, author, '작가 생성 완료.');
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  const authors = await authorService.findAll();

  return makeSuccessResponse(res, SUCCESS_CODE, authors, '다 가져옴');
};

const getOne = async (req: Request, res: Response, next: NextFunction) => {
  assertAll(req, [isNumeric('id')]);
  const authorId = parseInt(req.params.id, 10);
  const author = await authorService.findById(authorId);

  if (author) {
    return makeSuccessResponse(res, SUCCESS_CODE, author, '하나 가져옴');
  } else {
    return makeFailResponse(
      res,
      NOT_FOUND_ERROR,
      '그런 아이디를 가진 작가는 없음',
    );
  }
};

const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
  assertAll(req, [isNumeric('id')]);
  const authorId = parseInt(req.params.id, 10);
  try {
    const destroyedCount = await authorService.destroyById(authorId);
    if (destroyedCount === 0) {
      return makeFailResponse(
        res,
        NOT_FOUND_ERROR,
        '그런 아이디를 가진 작가는 없음',
      );
    }
    return makeSuccessResponse(
      res,
      SUCCESS_CODE,
      { destroyedCount },
      '제거 성공',
    );
  } catch (err) {
    return makeFailResponse(res, SERVER_ERROR, '뭔가 서버 에러 남');
  }
};

const router = Router();

router.post('/', asyncHandler(createOne));
router.get('/', asyncHandler(getAll));
router.get('/:id', asyncHandler(getOne));
router.delete('/:id', asyncHandler(deleteOne));

export default router;
