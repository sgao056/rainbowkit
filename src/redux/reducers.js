import { combineReducers } from 'redux';
import settings from './settings/reducer';
import menu from './menu/reducer';
import community from './community/reducer';
import auth from './auth/reducer';
import loginPending from './loginPending/reducer';

const reducers = combineReducers({
  community,
  menu,
  settings,
  auth,
  loginPending
});

export default reducers;
