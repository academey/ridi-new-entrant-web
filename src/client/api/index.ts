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
    body: {
      // TODO: 현재 반납 시각을 입력받는 인풋이 없어서 하드코딩 해 둠. 추후 인풋이 생기면 받고, 검증한 뒤 요청 날릴 예정
      endAt: '2019-06-01',
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
