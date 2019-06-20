import { getAccessToken } from './storage';

export function loggedIn() {
  return !!getAccessToken();
  if (getAccessToken()) {
    return {
      result: true,
      pathname: '',
    };
  }

  return {
    result: false,
    pathname: null,
  };
}
interface ICheckUnAuthorizedErrorParam {
  response: {
    status: number;
  };
}
export const checkUnAuthorizedError = ({
  response: { status },
}: ICheckUnAuthorizedErrorParam) => status === 401;
