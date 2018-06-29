import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { FileView } from './components/fileView'
import DevTools from 'mobx-react-devtools'
import { Route, Link, Switch, Redirect } from 'react-router-dom';
import {LoginPage} from './components/login';
import {Home} from './components/Home';
import Navbar from './components/navbar';
import { store } from './FileStore';
import { Provider } from 'mobx-react';


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
      <Provider store={store}>
        <div className="container">
          <Navbar />
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute path="/catalog" component={FileView} />
          <Route path="/login" component={LoginPage} /> 
        </div>
      </Provider>
    )
  }
}

export default App;
