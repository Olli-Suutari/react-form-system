import thunkMiddleware from 'redux-thunk';
import { applyMiddleware, createStore, compose } from 'redux';
// import { createLogger } from 'redux-logger';

import combinedReducers from './index';

// const loggerMiddleware = createLogger();

const enhancer = compose(
  applyMiddleware(
    thunkMiddleware,
    // loggerMiddleware,
  ),
);

export default function configureStore(initialState) {
  const store = createStore(combinedReducers, initialState, enhancer);

  // Hot reload reducers
  if (module.hot) {
    module.hot.accept('./', () =>
      store.replaceReducer(combinedReducers),
    );
  }
  return store;
}
