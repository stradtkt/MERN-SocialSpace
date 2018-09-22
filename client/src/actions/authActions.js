import {GET_ERRORS, SET_CURRENT_USER} from './types';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

export const registeruser = (userData, history) => dispatch => {
    axios
    .post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err => dispatch({
        type: GET_ERRORS,
        payload: err.response.data
    }));
}
export const loginuser = userData => dispatch => {
    axios.post('/api/users/login', userData)
        .then(res => {
            const {token} = res.data;
            localStorage.setItem('jwtToken', token);
            setAuthToken(token);
            const decoded = jwt_decode(token);
            dispatch(setCurrentUser(decoded));
        })
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }));
}

export const logoutuser = () => dispatch => {
    //Clearing the token set to the user
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
}

export const setCurrentUser = (decoded) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}