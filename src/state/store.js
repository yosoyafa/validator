import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

export const configureStore = initialState => {
  const middlewares = [];
  middlewares.push(thunk);

  const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middlewares)),
  );

  return {store};
};
