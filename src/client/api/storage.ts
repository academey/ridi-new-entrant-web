export function setAccessTokenInSessionStorage(accessToken: string) {
  sessionStorage.setItem('accessToken', accessToken);
}

export function setAccessTokenInLocalStorage(accessToken: string) {
  localStorage.setItem('accessToken', accessToken);
}

export function setAccessToken(accessToken: string, doesRememberThis: boolean) {
  if (doesRememberThis) {
    setAccessTokenInLocalStorage(accessToken);
  } else {
    setAccessTokenInSessionStorage(accessToken);
  }
}

export function setAccountTypeInSessionStorage(accountType: string) {
  sessionStorage.setItem('accountType', accountType);
}

export function setAccountTypeInLocalStorage(accountType: string) {
  localStorage.setItem('accountType', accountType);
}

export function setAccountType(accountType: string, doesRememberThis: string) {
  if (doesRememberThis) {
    setAccountTypeInLocalStorage(accountType);
  } else {
    setAccountTypeInSessionStorage(accountType);
  }
}

function getAccessTokenInSessionStorage() {
  return sessionStorage.getItem('accessToken');
}

function getAccessTokenInLocalStorage() {
  return localStorage.getItem('accessToken');
}

export function getAccessToken() {
  return getAccessTokenInSessionStorage() || getAccessTokenInLocalStorage();
}

function getAccountTypeInSessionStorage() {
  return sessionStorage.getItem('accountType');
}

function getAccountTypeInLocalStorage() {
  return localStorage.getItem('accountType');
}

export function getAccountType() {
  return getAccountTypeInSessionStorage() || getAccountTypeInLocalStorage();
}

export function clearStorage() {
  sessionStorage.clear();
  localStorage.clear();
}
