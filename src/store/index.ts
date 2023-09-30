// import createSagaMiddleware, { Task } from 'redux-saga';
// import { Store, AnyAction } from 'redux';
import { rootReducer } from './reducers';
// import { rootSaga } from './sagas';
// import { IRootState } from './IRootState';
import {
  createWrapper,
  // HYDRATE,
} from 'next-redux-wrapper'
import {
  // Action,
  // AnyAction,
  // combineReducers,
  configureStore,
  // ThunkAction,
} from '@reduxjs/toolkit'

// import { persistStore, persistReducer } from 'redux-persist'
// @ts-ignore
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
 
const isDev = process.env.NODE_ENV === 'development';

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

// NOTE: See also https://stackoverflow.com/questions/70426965/how-to-use-next-redux-wrapper-with-next-js-redux-toolkit-and-typescript-p
// const hydratedRootReducer = (state: any, action: AnyAction) => {
//   if (action.type === HYDRATE) {
//     const nextState = {
//       ...state, // use previous state
//       ...action.payload, // apply delta from hydration
//     };
//     return nextState
//   }
//   return rootReducer(state, action)
// }

// NOTE: See also https://github.com/fazlulkarimweb/with-next-redux-wrapper-redux-persist
const makeStore = (_ctx: any) => {
  // console.log('-- 1. makeStore on server')
  // console.log('--')
  if (_ctx.isServer) {
    // If it's on server side, create a store
    return configureStore({ reducer: rootReducer })
  } else {
    // If it's on client side, create a store which will persist
    const { persistStore, persistReducer } = require('redux-persist');
    // const storage = require('redux-persist/lib/storage')
    const persistConfig = {
      key: 'nextjs',
      whitelist: ['todo2023'], // only counter will be persisted, add other reducers if needed
      storage, // if needed, use a safer storage
    };
    const persistedReducer = persistReducer(persistConfig, rootReducer); // Create a new reducer with our existing reducer
    const store = configureStore({
      reducer: persistedReducer,
    }); // Creating the store again

    // @ts-ignore
    store.__persistor = persistStore(store); // This creates a persistor object & push that persisted object to .__persistor, so that we can avail the persistability feature

    return store;
  }
}

// Export the wrapper & wrap the pages/_app.js with this wrapper only
export const wrapper = createWrapper(makeStore, { debug: isDev })
