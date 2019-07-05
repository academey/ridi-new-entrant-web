import Cookies from 'js-cookie';
export const ACCESS_TOKEN_KEY = 'access_token';

export function setAccessTokenInSessionStorage(accessToken: string) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export function setAccessTokenInLocalStorage(accessToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export function setAccessToken(accessToken: string, doesRememberThis: boolean) {
  if (doesRememberThis) {
    setAccessTokenInLocalStorage(accessToken);
  } else {
    setAccessTokenInSessionStorage(accessToken);
  }
}

function getAccessTokenInCookie() {
  return Cookies.get(ACCESS_TOKEN_KEY);
}

function getAccessTokenInSessionStorage() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

function getAccessTokenInLocalStorage() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getAccessToken(): string {
  return (
    getAccessTokenInCookie() ||
    getAccessTokenInSessionStorage() ||
    getAccessTokenInLocalStorage()
  );
}

export function clearStorage() {
  sessionStorage.clear();
  localStorage.clear();
  Cookies.remove(ACCESS_TOKEN_KEY);
}
