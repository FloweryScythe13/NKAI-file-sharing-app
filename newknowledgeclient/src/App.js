import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { FileView } from './components/fileView'
import DevTools from 'mobx-react-devtools'
import { Route, Link, Switch, Redirect } from 'react-router-dom';
import {LoginPage} from './components/login';
import {Home} from './components/Home';
import request from 'superagent';
import Navbar from './components/navbar';
import { store } from './FileStore'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest}
      render={props => store.isAuthenticated ? (<Component {...props} /> ) : (
          <Redirect to={{
              pathname: "/login", state: { from: props.location }
          }}
          /> 
      )}
  />
)

class App extends Component {
  render() {   
    return (
      <div className="container">
        <Navbar />
        <PrivateRoute exact path="/" component={Home} />
        <PrivateRoute path="/catalog" component={FileView} />
        <Route path="/login" component={LoginPage} /> 
      </div>
    )
  }
}

export default App;
