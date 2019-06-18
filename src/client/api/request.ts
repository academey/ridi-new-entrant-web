import request from 'request-promise';
import { IApiResponse, RESPONSE_STATUS } from 'server/utils/result';

const URL = 'http://0.0.0.0:8080';

function getRequestURL(url: string) {
  return `${URL}/api/${url}`;
}

export default async function requestApi(path: string): Promise<IApiResponse> {
  try {
    const data: IApiResponse = await request({
      uri: getRequestURL(path),
      headers: {
        'User-Agent': 'Request-Promise',
      },
      json: true,
    });
    if (data.status !== RESPONSE_STATUS.SUCCESS) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw new Error(error);
  }
}
