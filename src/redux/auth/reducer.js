import { LOGIN, LOGOUT } from '../constants';

const INIT_STATE = {
  wallet: null,
  email:null,
  balance:null,
  resource:null,
  claimed:true,
  id:0
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case LOGIN:
      return { 
          ...state, 
          wallet: action.payload.wallet,
          email: action.payload.email,
          balance: action.payload.balance,
          resource: action.payload.resource,
          claimed:action.payload.claimed,
          id:action.payload.id
      };
    case LOGOUT:
    return { 
        ...state, 
        wallet: null,
        email:null,
        balance:null,
        resource:null,
        claimed:true,
        id:0
    };
    default:
      return { 
          ...state 
      };
  }
};