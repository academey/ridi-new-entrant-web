import { Response } from 'express';

export enum RESPONSE_STATUS {
  SUCCESS = 'success',
  FAIL = 'fail',
}

export function makeSuccessJson(result: object, message: string): IApiResponse {
  return {
    status: RESPONSE_STATUS.SUCCESS,
    result,
    message,
  };
}

export function makeSuccessResponse(
  res: Response,
  code: number,
  result: object,
  message: string,
) {
  return res.status(code).json(makeSuccessJson(result, message));
}

export function makeFailJson(message: string): IApiResponse {
  return {
    status: RESPONSE_STATUS.FAIL,
    message,
  };
}

export function makeFailResponse(res: Response, code: number, message: string) {
  return res.status(code).json(makeFailJson(message));
}

export interface IApiResponse {
  status: RESPONSE_STATUS;
  result?: object | object[];
  message: string;
}
