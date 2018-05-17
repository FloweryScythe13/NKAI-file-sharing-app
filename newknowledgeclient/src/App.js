import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { FileView } from './components/fileView'

class App extends Component {
  state = {
    output: {
      files: [],
      directories: []
    }
  }

  componentDidMount() {
    var that = this;
    fetch('/catalog')
    .then(console.log('data fetched'))
      .then(res => res.json())
      .then(function(output) {
        var x = output;
        console.log('x is');
        console.log(x)
        console.log(output.directories)
        that.setState({ output: x.output });
      })
  }
  render() {
    var output = this.state.output;
    console.log(output);
    console.log(output.directories);
    console.log(output.output);
    var directories = this.state.output.directories;
    console.log(directories);
    // return (
    //   <div className="App">
    //     <header className="App-header">
    //       <img src={logo} className="App-logo" alt="logo" />
    //       <h1 className="App-title">Welcome to React</h1>
    //     </header>
    //     <p className="App-intro">
    //       To get started, edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     {this.state.output.directories.map(directory => 
    //       <div key={directory.id}>{directory.name}</div>
    //     )}
    //   </div>
    // );
    return (
      <div>
        <FileView />
      </div>
    )
  }
}

export default App;
