import { CHANGE_COMMUNITY } from '../constants';

const INIT_STATE = {
  community:''
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case CHANGE_COMMUNITY:
      return { 
          ...state, 
          community: action.payload 
      };
    default:
      return { 
          ...state 
      };
  }
};