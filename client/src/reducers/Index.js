import { combineReducers } from 'redux';
import authReducer from './AuthReducer';
import errorReducer from './errorReducer';

export default combineReducers({
    auth: authReducer,
    errors: errorReducer
});