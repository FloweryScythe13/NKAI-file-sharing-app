import React from 'react';
import AxiosAPI from '../axiosApi';
import { Route, Link, Switch } from 'react-router-dom';
import { Nav, NavItem } from 'react-bootstrap';
var withRouter = require('react-router').withRouter;

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this._logout = this._logout.bind(this);
    }

    _logout(event) {
        event.preventDefault();
        AxiosAPI.post('/auth/logout')
            .then(res => {
                this.props.history.push('/login');
            })
            .catch(err => {
                console.log(err);
            });
        
    }
    
    render() {
        return (
            <Nav bsStyle="pills">
                
                    <NavItem eventKey={1}><Link to="/">Home</Link></NavItem>
                    <NavItem eventKey={2}><Link to="/catalog">Catalog</Link></NavItem>
                    <NavItem eventKey={3}><a onClick={ this._logout } href="#">Logout</a></NavItem>
                
            </Nav>
        )
    }
}

export default withRouter(Navbar);