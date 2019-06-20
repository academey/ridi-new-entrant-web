import { loginCheck } from 'client/api';
import { IStoreAction } from 'client/store';
import {
  actionCreators,
  LOGIN_CHECK_FAILED,
  LOGIN_CHECK_START,
  LOGIN_CHECK_SUCCEEDED,
} from 'client/store/auth';
import { notify } from 'react-notify-toast';
import { call, fork, put, select, takeLatest } from 'redux-saga/effects';

function* loginCheckStartGenerator(action: IStoreAction) {
  const { accessToken } = action.data;

  try {
    const { data, message } = yield call(loginCheck, { accessToken });
    yield put(actionCreators.loginCheckSucceeded(data, message));
  } catch (error) {
    yield put(actionCreators.loginCheckFailed(error));
  }
}

function* loginCheckStartWatcher() {
  yield takeLatest(LOGIN_CHECK_START, loginCheckStartGenerator);
}

function* loginCheckSucceededGenerator(action: IStoreAction) {
  yield call(notify.show, '로그인 성공!!!', 'success');
}

function* loginCheckSucceededWatcher() {
  yield takeLatest(LOGIN_CHECK_SUCCEEDED, loginCheckSucceededGenerator);
}

function* loginCheckFailedGenerator(action: IStoreAction) {
  yield call(
    notify.show,
    `로그인되지 않았음 ㅋㅋ 실패... ${action.error.message}`,
    'error',
  );
}

function* loginCheckFailedWatcher() {
  yield takeLatest(LOGIN_CHECK_FAILED, loginCheckFailedGenerator);
}

export default function* rootSaga() {
  yield fork(loginCheckStartWatcher);
  yield fork(loginCheckSucceededWatcher);
  yield fork(loginCheckFailedWatcher);
}
