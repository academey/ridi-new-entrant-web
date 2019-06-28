import requestApi from 'client/api/request';
import { getAccessToken } from 'client/utils/storage';
import { IApiResponse } from 'server/utils/result';

export async function requestBooks(): Promise<IApiResponse> {
  const data: IApiResponse = await requestApi('books');
  return data;
}

export async function requestBook(id: string): Promise<IApiResponse> {
  const data: IApiResponse = await requestApi(`books/${id}`);

  return data;
}

export async function borrowBook(id: string): Promise<IApiResponse> {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error('로그인하세요~');
  }
  const data: IApiResponse = await requestApi(`books/${id}/borrow`, {
    method: 'POST',
    auth: {
      bearer: accessToken,
    },
  });

  return data;
}

export async function returnBook(id: string): Promise<IApiResponse> {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error('로그인하세요~');
  }
  const data: IApiResponse = await requestApi(`books/${id}/return`, {
    method: 'POST',
    auth: {
      bearer: accessToken,
    },
  });

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
    body: {
      email,
      password,
    },
  });

  return data;
}

export async function loginCheck(): Promise<IApiResponse> {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error('토큰 없음~');
  }

  const data: IApiResponse = await requestApi('auth/login_check', {
    auth: {
      bearer: accessToken,
    },
  });

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
    body: {
      email,
      password,
    },
  });

  return data;
}
