import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { FileView } from './components/fileView'
import DevTools from 'mobx-react-devtools'

class App extends Component {
  

  
  render() {
    
    
    return (
      <div>
        <FileView />
        <DevTools />
      </div>
    )
  }
}

export default App;
