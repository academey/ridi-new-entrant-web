import { borrowBook, requestBooks, returnBook } from 'client/api';
import { IStoreAction } from 'client/store';
import {
  actionCreators,
  BOOK_BORROW_FAILED,
  BOOK_BORROW_START,
  BOOK_BORROW_SUCCEEDED,
  BOOK_GET_LIST_DATA_START,
  BOOK_RETURN_FAILED,
  BOOK_RETURN_START,
  BOOK_RETURN_SUCCEEDED,
} from 'client/store/book';
import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { notify } from 'react-notify-toast';

function* bookGetListDataStartGenerator() {
  try {
    const { data, message } = yield call(requestBooks);

    yield put(actionCreators.getListDataSucceeded(data, message));
  } catch (error) {
    yield put(actionCreators.getListDataFailed(error));
  }
}

function* bookGetListDataStartWatcher() {
  yield takeEvery(
    [BOOK_GET_LIST_DATA_START, BOOK_BORROW_SUCCEEDED, BOOK_RETURN_SUCCEEDED],
    bookGetListDataStartGenerator,
  );
}

function* bookBorrowStartGenerator(action: IStoreAction) {
  try {
    const { bookId } = action.data;
    const { data, message } = yield call(borrowBook, bookId);

    yield put(actionCreators.borrowSucceeded(data, message));
  } catch (error) {
    yield put(actionCreators.borrowFailed(error));
  }
}

function* bookBorrowStartWatcher() {
  yield takeEvery(BOOK_BORROW_START, bookBorrowStartGenerator);
}

function* bookReturnStartGenerator(action: IStoreAction) {
  try {
    const { bookId } = action.data;
    const { data, message } = yield call(returnBook, bookId);

    yield put(actionCreators.returnSucceeded(data, message));
  } catch (error) {
    yield put(actionCreators.returnFailed(error));
  }
}

function* bookReturnStartWatcher() {
  yield takeEvery(BOOK_RETURN_START, bookReturnStartGenerator);
}

function* bookBorrowAndReturnFailedGenerator(action: IStoreAction) {
  yield call(notify.show, action.error.message, 'error');
}

function* bookBorrowAndReturnFailedWatcher() {
  yield takeEvery(
    [BOOK_BORROW_FAILED, BOOK_RETURN_FAILED],
    bookBorrowAndReturnFailedGenerator,
  );
}

export default function* rootSaga() {
  yield fork(bookGetListDataStartWatcher);
  yield fork(bookBorrowStartWatcher);
  yield fork(bookReturnStartWatcher);
  yield fork(bookBorrowAndReturnFailedWatcher);
}
