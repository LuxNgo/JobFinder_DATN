import { combineReducers } from 'redux';
import userReducer from './userReducer';
import cvReducer from './cvReducer';
import statsReducer from './statsReducer';

const rootReducer = combineReducers({
  user: userReducer,
  cv: cvReducer,
  stats: statsReducer
});

export default rootReducer;
