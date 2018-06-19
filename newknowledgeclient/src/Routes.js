import React from 'react';
import ReactRouter from 'react-router';
import { FileView } from './components/fileView';
import Home from './components/Home'
var Route = ReactRouter.Route;
var NotFoundRoute = ReactRouter.NotFoundRoute;
var Redirect = ReactRouter.Redirect;

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest}
        render={props => fakeAuth.isAuthenticated ? (<Component {...props} /> ) : (
            <Redirect to={{
                pathname: "login", state: { from: props.location }
            }}
            /> 
        )}
    />
)


var routes = (
    <Route path="/">
        <Route exact path="" component={ Home } />
        <Route path="catalog" component={ FileView } />
        <Route path="login" component={require('./components/login')} />
    </Route>
)