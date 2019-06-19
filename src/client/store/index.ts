import { authReducer, AuthState } from 'client/store/auth';
import { bookReducer, BookState } from 'client/store/book';
import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import { FormStateMap, reducer as formReducer } from 'redux-form';

export interface IStoreAction {
  type: string;
  data: any;
  message: string;
  error: Error;
}

export interface IStoreState {
  router: RouterState;
  book: BookState;
  auth: AuthState;
  form: FormStateMap;
}

export default (history: History) =>
  combineReducers<IStoreState>({
    router: connectRouter(history),
    book: bookReducer,
    auth: authReducer,
    form: formReducer,
  });
