import requestApi from 'client/api/request';
import { IApiResponse } from 'server/utils/result';

export async function requestBooks(): Promise<IApiResponse> {
  const data: IApiResponse = await requestApi('book');

  return data;
}

export async function requestBook(id: string): Promise<IApiResponse> {
  const data: IApiResponse = await requestApi(`book/${id}`);

  return data;
}
