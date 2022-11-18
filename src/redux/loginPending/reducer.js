import { LOGIN_PENDING } from '../constants';

const INIT_STATE = {
  pending:false
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case LOGIN_PENDING:
      return { 
          ...state,
          pending: action.payload.pending
      };
    default:
      return { 
          ...state 
      };
  }
};