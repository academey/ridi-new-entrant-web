export enum RESPONSE_STATUS {
  SUCCESS = 'success',
  FAIL = 'fail',
}

export function makeResponse(
  status: RESPONSE_STATUS,
  result: object,
  message: string,
): IApiResponse {
  return {
    status,
    result,
    message,
  };
}

export function makeSuccessResponse(
  result: object,
  message: string,
): IApiResponse {
  return {
    status: RESPONSE_STATUS.SUCCESS,
    result,
    message,
  };
}

export function makeFailResponse(message: string): IApiResponse {
  return {
    status: RESPONSE_STATUS.FAIL,
    message,
  };
}

export interface IApiResponse {
  status: RESPONSE_STATUS;
  result?: object | object[];
  message: string;
}
