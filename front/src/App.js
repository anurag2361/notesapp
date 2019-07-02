import React, { Component } from 'react';
import './App.css';
import Header from './components/Header/header.js';
import CreateUser from './components/CreateUser/createuser.js';

class App extends Component {
  render() {
    return (
      <div>
        <Header></Header>
        <CreateUser history={this.props.history}></CreateUser>
      </div>
    );
  }
}

export default App;
