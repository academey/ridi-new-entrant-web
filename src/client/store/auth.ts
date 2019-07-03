import { IStoreAction } from 'client/store/index';
import { clearStorage } from 'client/utils/storage';
import { User } from 'database/models/User';
import { Record } from 'immutable';

// types
const resource = 'auth';
export const LOGIN_START = `${resource}/LOGIN_START`;
export const LOGIN_SUCCEEDED = `${resource}/LOGIN_SUCCEEDED`;
export const LOGIN_FAILED = `${resource}/LOGIN_FAILED`;

export const REGISTER_START = `${resource}/REGISTER_START`;
export const REGISTER_SUCCEEDED = `${resource}/REGISTER_SUCCEEDED`;
export const REGISTER_FAILED = `${resource}/REGISTER_FAILED`;

export const LOGIN_CHECK_START = `${resource}/LOGIN_CHECK_START`;
export const LOGIN_CHECK_SUCCEEDED = `${resource}/LOGIN_CHECK_SUCCEEDED`;
export const LOGIN_CHECK_FAILED = `${resource}/LOGIN_CHECK_FAILED`;

export const LOGOUT = `${resource}/LOGOUT`;

const AuthStateRecord = Record({
  loginLoading: false,
  loginError: false,
  loginErrorMessage: '',
  registerLoading: false,
  registerError: false,
  registerErrorMessage: '',
  user: null,
});

export class AuthState extends AuthStateRecord {
  public loginLoading: boolean;
  public loginError: boolean;
  public loginErrorMessage: string;
  public registerLoading: boolean;
  public registerError: boolean;
  public registerErrorMessage: string;
  public user: User;
}
const initialState = new AuthState();

// actions
function loginStart(email: string, password: string) {
  return {
    type: LOGIN_START,
    data: {
      email,
      password,
    },
  };
}

function loginSucceeded(data: any, message: string) {
  return {
    type: LOGIN_SUCCEEDED,
    data,
    message,
  };
}

function loginFailed(error: Error) {
  return {
    type: LOGIN_FAILED,
    error,
  };
}

function registerStart(email: string, password: string) {
  return {
    type: REGISTER_START,
    data: {
      email,
      password,
    },
  };
}

function registerSucceeded(data: any, message: string) {
  return {
    type: REGISTER_SUCCEEDED,
    data,
    message,
  };
}

function registerFailed(error: Error) {
  return {
    type: REGISTER_FAILED,
    error,
  };
}

function loginCheckStart() {
  return {
    type: LOGIN_CHECK_START,
  };
}

function loginCheckSucceeded(data: any, message: string) {
  return {
    type: LOGIN_CHECK_SUCCEEDED,
    data,
    message,
  };
}

function loginCheckFailed(error: Error) {
  clearStorage();

  return {
    type: LOGIN_CHECK_FAILED,
    error,
  };
}

function logout() {
  clearStorage();

  return {
    type: LOGOUT,
  };
}

export const actionCreators = {
  loginStart,
  loginSucceeded,
  loginFailed,
  registerStart,
  registerSucceeded,
  registerFailed,
  loginCheckStart,
  loginCheckSucceeded,
  loginCheckFailed,
  logout,
};

// reducers
export function authReducer(
  currentState = initialState,
  action: IStoreAction,
): AuthState {
  switch (action.type) {
    case LOGIN_START:
      return currentState.withMutations((state) => {
        state.set('loginLoading', true).set('loginError', false);
      });
    case LOGIN_SUCCEEDED:
      return currentState.withMutations((state) => {
        state
          .set('loginLoading', false)
          .set('loginError', false)
          .set('user', action.data.user);
      });
    case LOGIN_FAILED:
      return currentState.withMutations((state) => {
        state.set('loginLoading', false).set('loginError', true);
      });
    case REGISTER_START:
      return currentState.withMutations((state) => {
        state.set('registerLoading', true).set('registerError', false);
      });
    case REGISTER_SUCCEEDED:
      return currentState.withMutations((state) => {
        state
          .set('registerLoading', false)
          .set('registerError', false)
          .set('user', action.data.user);
      });
    case REGISTER_FAILED:
      return currentState.withMutations((state) => {
        state.set('registerLoading', false).set('registerError', true);
      });
    case LOGOUT:
      return currentState.withMutations((state) => {
        state.set('user', undefined);
      });
    case LOGIN_CHECK_START:
      return currentState.withMutations((state) => {
        state.set('loginLoading', true).set('loginError', false);
      });
    case LOGIN_CHECK_SUCCEEDED:
      return currentState.withMutations((state) => {
        state
          .set('loginLoading', false)
          .set('loginError', false)
          .set('user', action.data.user);
      });
    case LOGIN_CHECK_FAILED:
      return currentState.withMutations((state) => {
        state.set('loginLoading', false).set('loginError', true);
      });
    default:
      return currentState;
  }
}
