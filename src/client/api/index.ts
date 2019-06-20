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

interface ILoginCheckParam {
  accessToken: string;
}

export async function loginCheck({
  accessToken,
}: ILoginCheckParam): Promise<IApiResponse> {
  const data: IApiResponse = await requestApi('auth/login_check', {
    method: 'GET',
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
