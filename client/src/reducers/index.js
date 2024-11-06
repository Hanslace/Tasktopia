import { combineReducers } from 'redux';
import authReducer from './authReducer';
import projectReducer from './projectReducer';
import taskReducer from './taskReducer';
import invoiceReducer from './invoiceReducer';
import alertReducer from './alertReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer,
  task: taskReducer,
  invoice: invoiceReducer,
  alert: alertReducer,
});

export default rootReducer;