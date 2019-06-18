import { Book } from 'database/models/Book';
import { fromJS } from 'immutable';

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

export interface IBookState {
  isLoading: boolean;
  error: boolean;
  errorMessage: string;
  data: Book;
  listData: Book[];
}

const initialState: IBookState = {
  isLoading: false,
  error: false,
  errorMessage: '',
  data: fromJS({}),
  listData: fromJS([]),
};

// actions
interface IAction {
  type: string;
  data: any;
  meta: {
    id: number;
  };
}

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

function getListDataFailed(message: string) {
  return {
    type: BOOK_GET_LIST_DATA_FAILED,
    message,
  };
}

export const actionCreators = {
  getListDataStart,
  getListDataSucceeded,
  getListDataFailed,
};

// reducers
export function bookReducer(state = initialState, action: IAction): IBookState {
  switch (action.type) {
    case BOOK_GET_LIST_DATA_START:
      return {
        ...state,
        data: undefined,
      };
    case BOOK_GET_LIST_DATA_SUCCEEDED:
      console.log(action);
      return {
        ...state,
        listData: action.data.books,
      };
    default:
      return state;
  }
}
