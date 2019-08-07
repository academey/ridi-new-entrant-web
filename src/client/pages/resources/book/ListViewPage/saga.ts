import {
  borrowBook,
  checkAvailableToBorrowBook,
  requestBooks,
  returnBook,
} from 'client/api';
import { IStoreAction } from 'client/store';
import {
  actionCreators,
  BOOK_BORROW_FAILED,
  BOOK_BORROW_START,
  BOOK_BORROW_SUCCEEDED,
  BOOK_CHECK_AVAILABLE_TO_BORROW_START,
  BOOK_GET_LIST_DATA_START,
  BOOK_RETURN_FAILED,
  BOOK_RETURN_START,
  BOOK_RETURN_SUCCEEDED,
} from 'client/store/book';
import { notify } from 'react-notify-toast';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

function* bookGetListDataStartGenerator() {
  try {
    const { result, message } = yield call(requestBooks);

    yield put(actionCreators.getListDataSucceeded(result, message));
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
    const { bookId, duration } = action.data;
    const { result, message } = yield call(borrowBook, bookId, duration);

    yield put(actionCreators.borrowSucceeded(result, message));
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
    const { result, message } = yield call(returnBook, bookId);

    yield put(actionCreators.returnSucceeded(result, message));
  } catch (error) {
    yield put(actionCreators.returnFailed(error));
  }
}

function* bookReturnStartWatcher() {
  yield takeEvery(BOOK_RETURN_START, bookReturnStartGenerator);
}

function* bookCheckAvailableToBorrowGenerator() {
  try {
    const { result, message } = yield call(checkAvailableToBorrowBook);

    yield put(actionCreators.checkAvailableToBorrowSucceeded(result, message));
  } catch (error) {
    yield put(actionCreators.checkAvailableToBorrowFailed(error));
  }
}

function* bookCheckAvailableToBorrowStartWatcher() {
  yield takeEvery(
    [BOOK_CHECK_AVAILABLE_TO_BORROW_START, BOOK_RETURN_SUCCEEDED],
    bookCheckAvailableToBorrowGenerator,
  );
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
  yield fork(bookCheckAvailableToBorrowStartWatcher);
  yield fork(bookBorrowAndReturnFailedWatcher);
}
