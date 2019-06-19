import { register } from 'client/api';
import { IStoreAction } from 'client/store';
import {
  actionCreators,
  REGISTER_FAILED,
  REGISTER_START,
  REGISTER_SUCCEEDED,
} from 'client/store/auth';
import { push } from 'connected-react-router';
import { notify } from 'react-notify-toast';
import { call, fork, put, select, takeLatest } from 'redux-saga/effects';

function* registerStartGenerator(action: IStoreAction) {
  const { email, password } = action.data;
  try {
    const { data, message } = yield call(register, { email, password });

    yield put(actionCreators.registerSucceeded(data, message));
  } catch (error) {
    yield put(actionCreators.registerFailed(error));
  }
}

function* registerStartWatcher() {
  yield takeLatest(REGISTER_START, registerStartGenerator);
}

function* registerSucceededGenerator() {
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
