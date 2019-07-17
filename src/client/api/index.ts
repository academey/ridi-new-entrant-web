import { requestApi, requestApiWithAuthentication } from 'client/api/request';
import moment from 'moment';
import { IApiResponse } from 'server/utils/result';

export async function requestBooks(): Promise<IApiResponse> {
  const data: IApiResponse = await requestApi('books');
  return data;
}

export async function requestBook(id: string): Promise<IApiResponse> {
  const data: IApiResponse = await requestApi(`books/${id}`);

  return data;
}

export async function borrowBook(
  id: string,
  borrowDuration: string,
): Promise<IApiResponse> {
  const endAt = moment().add(borrowDuration, 'm');
  const data: IApiResponse = await requestApiWithAuthentication(
    `books/${id}/borrow`,
    {
      method: 'POST',
      data: {
        endAt,
      },
    },
  );

  return data;
}

export async function returnBook(id: string): Promise<IApiResponse> {
  const data: IApiResponse = await requestApiWithAuthentication(
    `books/${id}/return`,
    {
      method: 'POST',
    },
  );

  return data;
}

export async function checkAvailableToBorrowBook(): Promise<IApiResponse> {
  const data: IApiResponse = await requestApiWithAuthentication(
    `books/check_available_to_borrow`,
    {
      method: 'POST',
    },
  );

  return data;
}

interface ILoginParam {
  email: string;
  password: string;
}

export async function login({
  email,
  password,
}: ILoginParam): Promise<IApiResponse> {
  const data: IApiResponse = await requestApi('auth/login', {
    method: 'POST',
    data: {
      email,
      password,
    },
  });

  return data;
}
export async function loginCheck(): Promise<IApiResponse> {
  const data: IApiResponse = await requestApiWithAuthentication(
    'auth/login_check',
  );

  return data;
}

interface IRegisterParam {
  email: string;
  password: string;
}

export async function register({
  email,
  password,
}: IRegisterParam): Promise<IApiResponse> {
  const data: IApiResponse = await requestApi('auth/register', {
    method: 'POST',
    data: {
      email,
      password,
    },
  });

  return data;
}
