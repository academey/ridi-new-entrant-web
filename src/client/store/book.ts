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
  borrowLoading: false,
  borrowError: false,
  borrowErrorMessage: '',
  returnLoading: false,
  returnError: false,
  returnErrorMessage: '',
  data: fromJS({}),
  listData: fromJS([]),
});

export class BookState extends BookStateRecord {
  public getListDataLoading: boolean;
  public getListDataError: boolean;
  public getListDataErrorMessage: string;
  public borrowLoading: boolean;
  public borrowError: boolean;
  public borrowErrorMessage: string;
  public returnLoading: boolean;
  public returnError: boolean;
  public returnErrorMessage: string;
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

function borrowStart(bookId: number) {
  return {
    type: BOOK_BORROW_START,
    data: {
      bookId,
    },
  };
}

function borrowSucceeded(data: any, message: string) {
  return {
    type: BOOK_BORROW_SUCCEEDED,
    data,
    message,
  };
}

function borrowFailed(error: Error) {
  return {
    type: BOOK_BORROW_FAILED,
    error,
  };
}

function returnStart(bookId: number) {
  return {
    type: BOOK_RETURN_START,
    data: {
      bookId,
    },
  };
}

function returnSucceeded(data: any, message: string) {
  return {
    type: BOOK_RETURN_SUCCEEDED,
    data,
    message,
  };
}

function returnFailed(error: Error) {
  return {
    type: BOOK_RETURN_FAILED,
    error,
  };
}

export const actionCreators = {
  getListDataStart,
  getListDataSucceeded,
  getListDataFailed,
  borrowStart,
  borrowSucceeded,
  borrowFailed,
  returnStart,
  returnSucceeded,
  returnFailed,
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
          .set('listData', action.data);
      });
    case BOOK_GET_LIST_DATA_FAILED:
      return currentState.withMutations((state) => {
        state.set('getListDataLoading', false).set('getListDataError', true);
      });
    case BOOK_BORROW_START:
      return currentState.withMutations((state) => {
        state.set('borrowLoading', true).set('borrowError', false);
      });
    case BOOK_BORROW_SUCCEEDED:
      return currentState.withMutations((state) => {
        state.set('borrowLoading', false).set('borrowError', false);
      });
    case BOOK_BORROW_FAILED:
      return currentState.withMutations((state) => {
        state.set('borrowLoading', false).set('borrowError', true);
      });
    case BOOK_RETURN_START:
      return currentState.withMutations((state) => {
        state.set('returnLoading', true).set('returnError', false);
      });
    case BOOK_RETURN_SUCCEEDED:
      return currentState.withMutations((state) => {
        state.set('returnLoading', false).set('returnError', false);
      });
    case BOOK_RETURN_FAILED:
      return currentState.withMutations((state) => {
        state.set('returnLoading', false).set('returnError', true);
      });
    default:
      return currentState;
  }
}