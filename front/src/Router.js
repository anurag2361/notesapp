import React, { Component } from 'react';
import App from './App.js';
import { Switch, Route } from 'react-router-dom';
import CreateUser from './components/CreateUser/createuser.js';
import AllNote from './components/AllNote/allnote.js';

class Router extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path='/' component={App} />
                    <Route exact path='/createuser' component={CreateUser} />
                    <Route exact path='/:userid/allnotes' component={AllNote} />
                </Switch>
            </div>
        )
    }
}
export default Router;