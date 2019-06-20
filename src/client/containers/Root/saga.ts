import { loginCheck } from 'client/api';
import {
  actionCreators,
  LOGIN_CHECK_START,
  LOGIN_CHECK_SUCCEEDED,
} from 'client/store/auth';
import { notify } from 'react-notify-toast';
import { call, fork, put, select, takeLatest } from 'redux-saga/effects';

function* loginCheckStartGenerator() {
  try {
    const { data, message } = yield call(loginCheck);
    yield put(actionCreators.loginCheckSucceeded(data, message));
  } catch (error) {
    yield put(actionCreators.loginCheckFailed(error));
  }
}

function* loginCheckStartWatcher() {
  yield takeLatest(LOGIN_CHECK_START, loginCheckStartGenerator);
}

function* loginCheckSucceededGenerator() {
  yield call(notify.show, '로그인 성공!!!', 'success');
}

function* loginCheckSucceededWatcher() {
  yield takeLatest(LOGIN_CHECK_SUCCEEDED, loginCheckSucceededGenerator);
}

export default function* rootSaga() {
  yield fork(loginCheckStartWatcher);
  yield fork(loginCheckSucceededWatcher);
}
