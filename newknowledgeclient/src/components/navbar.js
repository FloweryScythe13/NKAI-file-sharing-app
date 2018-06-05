import React from 'react';
import request from 'superagent';
import { Route, Link, Switch } from 'react-router-dom';
var withRouter = require('react-router').withRouter;

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this._logout = this._logout.bind(this);
    }

    _logout(event) {
        event.preventDefault();
        request.post('/auth/logout');
        this.props.history.push('/login');
    }
    

    render() {
        return (
            <nav className="navbar navbar-light">
                <ul className="nav navbar-nav">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/catalog">Catalog</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><a onClick={ this._logout } href="#">Logout</a></li>
                </ul>
            </nav>
        )
    }
}

export default withRouter(Navbar);