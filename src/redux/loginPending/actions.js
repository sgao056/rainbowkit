import { LOGIN_PENDING } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const loginPending = (pending) => {
  return {
    type: LOGIN_PENDING,
    payload: pending
  };
};