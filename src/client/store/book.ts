import { AuthState } from 'client/store/auth';
import { IStoreAction } from 'client/store/index';
import { Book } from 'database/models/Book';
import { fromJS, Record } from 'immutable';

// types
const resource = 'book';
export const BOOK_GET_LIST_DATA_START = `${resource}/BOOK_GET_LIST_DATA_START`;
export const BOOK_GET_LIST_DATA_SUCCEEDED = `${resource}/BOOK_GET_LIST_DATA_SUCCEEDED`;
export const BOOK_GET_LIST_DATA_FAILED = `${resource}/BOOK_GET_LIST_DATA_FAILED`;

export const BOOK_BORROW_START = `${resource}/BOOK_BORROW_START`;
export const BOOK_BORROW_SUCCEEDED = `${resource}/BOOK_BORROW_SUCCEEDED`;
export const BOOK_BORROW_FAILED = `${resource}/BOOK_BORROW_FAILED`;

export const BOOK_RETURN_START = `${resource}/BOOK_RETURN_START`;
export const BOOK_RETURN_SUCCEEDED = `${resource}/BOOK_RETURN_SUCCEEDED`;
export const BOOK_RETURN_FAILED = `${resource}/BOOK_RETURN_FAILED`;

const BookStateRecord = Record({
  getListDataLoading: false,
  getListDataError: false,
  getListDataErrorMessage: '',
  data: fromJS({}),
  listData: fromJS([]),
});

export class BookState extends BookStateRecord {
  public getListDataLoading: boolean;
  public getListDataError: boolean;
  public getListDataErrorMessage: string;
  public data: Book;
  public listData: Book[];
}

const initialState = new BookState();

// actions
function getListDataStart() {
  return {
    type: BOOK_GET_LIST_DATA_START,
  };
}

function getListDataSucceeded(data: any, message: string) {
  return {
    type: BOOK_GET_LIST_DATA_SUCCEEDED,
    data,
    message,
  };
}

function getListDataFailed(error: Error) {
  return {
    type: BOOK_GET_LIST_DATA_FAILED,
    error,
  };
}

export const actionCreators = {
  getListDataStart,
  getListDataSucceeded,
  getListDataFailed,
};

// reducers
export function bookReducer(
  currentState = initialState,
  action: IStoreAction,
): BookState {
  switch (action.type) {
    case BOOK_GET_LIST_DATA_START:
      return currentState.withMutations((state) => {
        state.set('getListDataLoading', true).set('getListDataError', false);
      });
    case BOOK_GET_LIST_DATA_SUCCEEDED:
      return currentState.withMutations((state) => {
        state
          .set('getListDataLoading', false)
          .set('getListDataError', false)
          .set('listData', action.data.books);
      });
    case BOOK_GET_LIST_DATA_FAILED:
      return currentState.withMutations((state) => {
        state.set('getListDataLoading', false).set('getListDataError', true);
      });
    default:
      return currentState;
  }
}
