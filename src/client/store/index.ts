import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import { bookReducer, IBookState } from './book';

export interface IStoreState {
  router: RouterState;
  book: IBookState;
}

export default (history: History) =>
  combineReducers<IStoreState>({
    router: connectRouter(history),
    book: bookReducer,
  });
