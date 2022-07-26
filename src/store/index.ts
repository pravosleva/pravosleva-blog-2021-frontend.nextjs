// import createSagaMiddleware, { Task } from 'redux-saga';
// import { Store, AnyAction } from 'redux';
import { rootReducer } from './reducers';
// import { rootSaga } from './sagas';
// import { IRootState } from './IRootState';
import { createWrapper } from 'next-redux-wrapper'
import { configureStore } from '@reduxjs/toolkit'

// const isDev = process.env.NODE_ENV === 'development';

// export interface SagaStore extends Store<IRootState, AnyAction> {
//   sagaTask: Task;
// }

// const bindMiddleware = (middlewares: any[]) => {
//   if (process.env.NODE_ENV !== 'production') {
//     const { composeWithDevTools } = require('redux-devtools-extension');

//     return composeWithDevTools(applyMiddleware(...middlewares));
//   }

//   return applyMiddleware(...middlewares);
// };

// export const makeStore = (_context: any) => {
//   // const sagaMiddleware = createSagaMiddleware();
//   const store = createStore(
//     rootReducer,
//     // bindMiddleware([sagaMiddleware])
//   );

//   // store.sagaTask = sagaMiddleware.run(rootSaga);
//   return store;
// };

// export const wrapper = createWrapper(makeStore, { debug: isDev });

export const makeStore = () =>
  configureStore({
    reducer: rootReducer
  })

export const wrapper = createWrapper(makeStore)
