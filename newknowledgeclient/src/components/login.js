import React from 'react';
import { Form, Button } from 'react-bootstrap';
import AxiosAPI from '../axiosApi';
import { store } from '../FileStore';

export class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            errors: []
        }

        this._updateState = this._updateState.bind(this);
        this._onLoginSubmit = this._onLoginSubmit.bind(this);
    }

    _updateState(e) {
        var key = e.target.id;
        var value = e.target.value;
        var keysToUpdate = {};
        keysToUpdate[key] = value;
        this.setState(keysToUpdate);
    }
    
    //authorization and cookie-setting logic + AJAX calls go in here
    /* 1. User presses Login submit button
     * 2. The email and password values currently in the component state are sent in a request to http://localhost:3000/login
     * 3. On the API server, the user account is found and logged in, and a session is created for the user in the DB. 
     * 4. The user ID is written into the session that is attached to the request with req.session.currentUser. 
     * 5. The session is included in the response to the client
     * 6. ?
     */
    _onLoginSubmit(e) {
        e.preventDefault();
        var that = this;
        return AxiosAPI.post('auth/login', { username: that.state.username, password: that.state.password  })
                .then(res => {
                    store.isAuth();
                    this.props.history.push("/")
                })
                .catch(error =>
                    console.log(error)
                )
    }

    render() {
        return (
            <div className="container">
                <Form onSubmit={ this._onLoginSubmit } >
                    <h2>New Knowledge File Explorer: Login</h2>
                    <h4>Please sign in</h4>
                    <label htmlFor="username">Email</label>
                    <input type="email" id="username" placeholder="Username" required onChange={ this._updateState } />
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="Password" required onChange={ this._updateState } />
                    <Button type="submit">Login</Button>
                </Form>
            </div>
        )
    }
}