import { IStoreAction } from 'client/store/index';
import { Record } from 'immutable';

// types
const resource = 'auth';
export const LOGIN_START = `${resource}/LOGIN_START`;
export const LOGIN_SUCCEEDED = `${resource}/LOGIN_SUCCEEDED`;
export const LOGIN_FAILED = `${resource}/LOGIN_FAILED`;

export const REGISTER_START = `${resource}/REGISTER_START`;
export const REGISTER_SUCCEEDED = `${resource}/REGISTER_SUCCEEDED`;
export const REGISTER_FAILED = `${resource}/LOGIN_FAILED`;

const AuthStateRecord = Record({
  loginLoading: false,
  loginError: false,
  loginErrorMessage: '',
  registerLoading: false,
  registerError: false,
  registerErrorMessage: '',
  isLogin: false,
});

export class AuthState extends AuthStateRecord {
  public loginLoading: boolean;
  public loginError: boolean;
  public loginErrorMessage: string;
  public registerLoading: boolean;
  public registerError: boolean;
  public registerErrorMessage: string;
  public isLogin: boolean;
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

export const actionCreators = {
  loginStart,
  loginSucceeded,
  loginFailed,
  registerStart,
  registerSucceeded,
  registerFailed,
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
        state.set('loginLoading', false).set('loginError', false);
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
        state.set('registerLoading', false).set('registerError', false);
      });
    case REGISTER_FAILED:
      return currentState.withMutations((state) => {
        state.set('registerLoading', false).set('registerError', true);
      });
    default:
      return currentState;
  }
}
