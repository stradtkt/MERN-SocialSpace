import { combineReducers } from 'redux';
import authReducer from './AuthReducer';
import errorReducer from './errorReducer';
import profileReducer from './profileReducer';

export default combineReducers({
    auth: authReducer,
    errors: errorReducer,
    profile: profileReducer
});