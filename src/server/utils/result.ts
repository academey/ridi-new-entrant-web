export enum RESPONSE_STATUS {
  SUCCESS = 'success',
  FAIL = 'fail',
}

export function makeResponse(
  status: RESPONSE_STATUS,
  data: object,
  message: string,
): IApiResponse {
  return {
    status,
    data,
    message,
  };
}

export function makeSuccessResponse(
  data: object,
  message: string,
): IApiResponse {
  return {
    status: RESPONSE_STATUS.SUCCESS,
    data,
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
  data?: {
    [key: string]: any;
  };
  message: string;
}
