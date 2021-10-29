import {createAction} from 'redux-act';
import {API_URL} from '@env';

export const GET_USER = createAction('GET_USER', getUser);

const getUser = async userId => {
  try {
    const response = await fetch(API_URL + userId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();
    return json.data || {};
  } catch (error) {
    console.error(error);
  }
};
