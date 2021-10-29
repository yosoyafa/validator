import {createReducer} from 'redux-act';

import {GET_USER} from '../actions/users';

const initialState = {
  user: {},
};

export default createReducer(
  {
    [GET_USER]: (state, payload) => {
      return {
        ...state,
        user: payload,
      };
    },
  },
  initialState,
);
