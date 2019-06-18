import { requestBooks } from 'client/api';
import { actionCreators, BOOK_GET_LIST_DATA_START } from 'client/store/book';
import { call, put, takeEvery } from 'redux-saga/effects';

// worker Saga: 비동기 증가 태스크를 수행할겁니다.
export function* bookGetListDataStartGenerator() {
  try {
    const { data, message } = yield call(requestBooks);

    yield put(actionCreators.getListDataSucceeded(data, message));
  } catch (error) {
    yield put(actionCreators.getListDataFailed(error));
  }
}

// watcher Saga: 각각의 INCREMENT_ASYNC 에 bookGetListDataStartGenerator 태스크를 생성할겁니다.
export function* bookGetListDataStartWatcher() {
  yield takeEvery(BOOK_GET_LIST_DATA_START, bookGetListDataStartGenerator);
}
