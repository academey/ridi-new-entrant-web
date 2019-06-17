import { Book } from 'database/models/Book';
import request from 'request-promise';
import { IApiResponse } from 'server/utils/result';

const URL = 'http://0.0.0.0:8080';

function getRequestURL(url: string) {
  return `${URL}/api/${url}`;
}

export async function requestBooks(): Promise<IApiResponse> {
  const data: IApiResponse = await request({
    uri: getRequestURL('book/3'),
    headers: {
      'User-Agent': 'Request-Promise',
    },
    json: true,
  });
  const book: Book = data.data.book;
  console.log('book is ', book);

  return data;
}
