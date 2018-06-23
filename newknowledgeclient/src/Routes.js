import React from 'react';
import { FileView } from './components/fileView';
import { Home } from './components/Home'
import { LoginPage } from './components/login';
import { store } from './FileStore';
var ReactRouter = require('react-router');
var Route = ReactRouter.Route;
var NotFoundRoute = ReactRouter.NotFoundRoute;
var Redirect = ReactRouter.Redirect;

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


var routes = (
    <Route path="/">
        <PrivateRoute exact path="" component={ Home } />
        <PrivateRoute path="catalog" component={ FileView } />
        <Route path="login" component={ LoginPage } />
    </Route>
);

module.exports = routes;