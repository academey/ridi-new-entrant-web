export function isTest() {
  return process.env.NODE_ENV === 'test';
}

export function isDevelopment() {
  return process.env.NODE_ENV === 'development';
}

export function isProduction() {
  return process.env.NODE_ENV === 'production';
}

export function getClientHost() {
  if (isProduction()) {
    return 'http://54.180.137.113';
  } else {
    return 'http://0.0.0.0:3000';
  }
}

export function getServerHost() {
  if (isProduction()) {
    return 'http://54.180.137.113:8080';
  } else {
    return 'http://0.0.0.0:8080';
  }
}
