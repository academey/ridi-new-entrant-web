import { getAccessToken } from 'client/utils/storage';

export function getAuthHeader() {
  const accessToken = getAccessToken();
  if (accessToken) {
    return { Authorization: 'Bearer ' + accessToken };
  } else {
    return {};
  }
}
