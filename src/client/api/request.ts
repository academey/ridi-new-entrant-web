import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { clearStorage, getAccessToken } from 'client/utils/storage';
import { Secret, TokenExpiredError, verify } from 'jsonwebtoken';
import { ValidationError } from 'property-validator';
import { IApiResponse, RESPONSE_STATUS } from 'server/utils/result';

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
    throw new Error(error.response.data.message);
  }
}

export async function requestApiWithAuthentication(
  path: string,
  options?: AxiosRequestConfig,
): Promise<IApiResponse> {
  const authorizationHeader = await getAuthorizationHeader();

  return requestApi(path, {
    ...options,
    ...authorizationHeader,
  });
}

export async function getAuthorizationHeader() {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error('로그인 하세여~');
  }

  try {
    await verify(accessToken, process.env.JWT_SECRET);
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      clearStorage();
    }
    throw err;
  }

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
}
