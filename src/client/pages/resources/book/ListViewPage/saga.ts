import { requestBooks } from 'client/api';
import { actionCreators, BOOK_GET_LIST_DATA_START } from 'client/store/book';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

function* bookGetListDataStartGenerator() {
  try {
    const { data, message } = yield call(requestBooks);

    yield put(actionCreators.getListDataSucceeded(data, message));
  } catch (error) {
    yield put(actionCreators.getListDataFailed(error));
  }
}

function* bookGetListDataStartWatcher() {
  yield takeEvery(BOOK_GET_LIST_DATA_START, bookGetListDataStartGenerator);
}

export default function* rootSaga() {
  yield fork(bookGetListDataStartWatcher);
}
