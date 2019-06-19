import authLoginPageSagas from 'client/pages/auth/LoginPage/saga.ts';
import authRegisterPageSagas from 'client/pages/auth/RegisterPage/saga.ts';
import bookListViewPageSagas from 'client/pages/resources/book/ListViewPage/saga';
import { all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([
    bookListViewPageSagas(),
    authLoginPageSagas(),
    authRegisterPageSagas(),
  ]);
}
