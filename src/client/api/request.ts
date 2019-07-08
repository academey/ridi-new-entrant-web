import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { IApiResponse, RESPONSE_STATUS } from 'server/utils/result';
import { getAccessToken } from 'client/utils/storage';

const URL = `${window.location.hostname}:8080`;

function getRequestURL(url: string) {
  return `http://${URL}/api/${url}`;
}

export async function requestApi(
  path: string,
  options?: AxiosRequestConfig,
): Promise<IApiResponse> {
  try {
    const result: AxiosResponse<IApiResponse> = await axios({
      url: getRequestURL(path),
      withCredentials: true,
      ...options,
    });
    if (result.data.status !== RESPONSE_STATUS.SUCCESS) {
      throw new Error(result.data.message);
    }

    return result.data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function requestApiWithAuthentication(
  path: string,
  options?: AxiosRequestConfig,
): Promise<IApiResponse> {
  return requestApi(path, {
    ...options,
    ...getAuthorizationHeader(),
  });
}

export function getAuthorizationHeader() {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error('토큰 없음~');
  }
  // TODO: 토큰 만료 체크 로직 넣기

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
}
