import { IStoreState } from 'client/store';
import { routerMiddleware } from 'connected-react-router/immutable';
import { createBrowserHistory } from 'history';
import { fromJS } from 'immutable';
import { applyMiddleware, compose, createStore, Store } from 'redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import rootSaga from './sagas';
import createReducer from './store';

export const history = createBrowserHistory();
export default function configureStore(initialState = {}): Store<IStoreState> {
  const sagaMiddleware = createSagaMiddleware();
  const middleWares = [sagaMiddleware, routerMiddleware(history)];
  // if (process.env.NODE_ENV !== 'production') {
  //   middleWares.push(logger);
  // }
  middleWares.push(logger);

  const enhancers = [applyMiddleware(...middleWares)];
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
      : compose;

  const store = createStore(
    createReducer(history),
    fromJS(initialState),
    composeEnhancers(...enhancers),
  );

  sagaMiddleware.run(rootSaga);

  return store;
}
