import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { FileView } from './components/fileView'
import DevTools from 'mobx-react-devtools'
import { Route, Link, Switch } from 'react-router-dom';
import {LoginPage} from './components/login';
import {Home} from './components/Home';
import request from 'superagent';
import Navbar from './components/navbar';

class App extends Component {
  

  
  
  render() {
    
    
    return (
      <div>
        <Navbar />

        <Route exact path="/" component={Home} />
        <Route path="/catalog" component={FileView} />
        <Route path="/login" component={LoginPage} />
        
      </div>
    )
  }
}

export default App;
