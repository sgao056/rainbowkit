import { LOGIN, LOGOUT } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const Login = (wallet) => {
  return {
    type: LOGIN,
    payload: wallet
  };
};

export const Logout = (wallet) => {
  return {
    type: LOGOUT,
    payload: wallet
  };
};
