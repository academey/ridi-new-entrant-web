import { login } from 'client/api';
import { IStoreAction, IStoreState } from 'client/store';
import {
  actionCreators,
  LOGIN_FAILED,
  LOGIN_START,
  LOGIN_SUCCEEDED,
} from 'client/store/auth';
import { setAccessToken } from 'client/utils/storage';
import { push } from 'connected-react-router';
import { notify } from 'react-notify-toast';
import { call, fork, put, select, takeLatest } from 'redux-saga/effects';

function* loginStartGenerator(action: IStoreAction) {
  const { email, password } = action.data;

  try {
    const { data, message } = yield call(login, { email, password });
    yield put(actionCreators.loginSucceeded(data, message));
  } catch (error) {
    yield put(actionCreators.loginFailed(error));
  }
}

function* loginStartWatcher() {
  yield takeLatest(LOGIN_START, loginStartGenerator);
}

function* loginSucceededGenerator(action: IStoreAction) {
  // TODO: 나중에 시간되면 doesRememberThis 를 checkbox 로 입력받아서 변경하자
  setAccessToken(action.data.token, true);
  yield call(notify.show, '로그인 성공!!!', 'success');
  yield put(push('/'));
}

function* loginSucceededWatcher() {
  yield takeLatest(LOGIN_SUCCEEDED, loginSucceededGenerator);
}

function* loginFailedGenerator(action: IStoreAction) {
  yield call(notify.show, `로그인 실패... ${action.error.message}`, 'error');
}

function* loginFailedWatcher() {
  yield takeLatest(LOGIN_FAILED, loginFailedGenerator);
}

export default function* rootSaga() {
  yield fork(loginStartWatcher);
  yield fork(loginSucceededWatcher);
  yield fork(loginFailedWatcher);
}
