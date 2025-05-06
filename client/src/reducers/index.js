import { combineReducers } from 'redux';
import userReducer from './userReducer';
import cvReducer from './cvReducer';

const rootReducer = combineReducers({
  user: userReducer,
  cv: cvReducer
});

export default rootReducer;
