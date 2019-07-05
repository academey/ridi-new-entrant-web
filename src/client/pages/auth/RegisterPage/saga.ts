import { register } from 'client/api';
import { IStoreAction } from 'client/store';
import {
  actionCreators,
  REGISTER_FAILED,
  REGISTER_START,
  REGISTER_SUCCEEDED,
} from 'client/store/auth';
import { setAccessToken } from 'client/utils/storage';
import { push } from 'connected-react-router';
import { notify } from 'react-notify-toast';
import { call, fork, put, select, takeLatest } from 'redux-saga/effects';

function* registerStartGenerator(action: IStoreAction) {
  const { email, password } = action.data;
  try {
    const { result, message } = yield call(register, { email, password });

    yield put(actionCreators.registerSucceeded(result, message));
  } catch (error) {
    yield put(actionCreators.registerFailed(error));
  }
}

function* registerStartWatcher() {
  yield takeLatest(REGISTER_START, registerStartGenerator);
}

function* registerSucceededGenerator(action: IStoreAction) {
  // TODO: 나중에 시간되면 doesRememberThis 를 checkbox 로 입력받아서 변경하자
  // setAccessToken(action.data.token, false);
  yield call(notify.show, '회원가입 후 로그인 성공!!!', 'success');
  yield put(push('/'));
}

function* registerSucceededWatcher() {
  yield takeLatest(REGISTER_SUCCEEDED, registerSucceededGenerator);
}

function* registerFailedGenerator(action: IStoreAction) {
  yield call(notify.show, `회원가입 실패... ${action.error.message}`, 'error');
}

function* registerFailedWatcher() {
  yield takeLatest(REGISTER_FAILED, registerFailedGenerator);
}

export default function* rootSaga() {
  yield fork(registerStartWatcher);
  yield fork(registerSucceededWatcher);
  yield fork(registerFailedWatcher);
}
