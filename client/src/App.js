import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutuser } from './actions/authActions';
import store from './Store';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/create-profile/CreateProfile';

import './App.css';
import { clearCurrentProfile } from './actions/profileActions';
import PrivateRoute from './components/common/PrivateRoute';
import EditProfile from './components/edit-profile/EditProfile';

//Checking to make sure the person is logged in on every page request
//Check for token
if(localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded));
  //Check for expired token
  const currentTime = Date.now() / 1000;
  if(decoded.exp < currentTime) {
    store.dispatch(logoutuser());
    store.dispatch(clearCurrentProfile());
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
      <Router>
      <div className="App">
      <Navbar/>
        <Route exact path="/" component={Landing}/>
        <div className="container">
          <Route exact path="/register" component={Register}/>
          <Route exact path="/login" component={Login}/>
          <Switch>
          <PrivateRoute exact path="/dashboard" component={Dashboard}/>
          <PrivateRoute exact path="/create-profile" component={CreateProfile}/>
          </Switch>
          <Switch>
          <PrivateRoute exact path="/edit-profile" component={EditProfile}/>
          </Switch>
        </div>
        <Footer/>
      </div>
      </Router>
      </Provider>
    );
  }
}

export default App;
