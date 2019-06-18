import { bookGetListDataStartWatcher } from 'client/pages/resources/book/ListViewPage/saga';
import { all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([bookGetListDataStartWatcher()]);
}
