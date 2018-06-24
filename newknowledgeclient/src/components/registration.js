import React from 'react';
import { Form, Button } from 'react-bootstrap';
import AxiosAPI from '../axiosApi';
import { store } from '../FileStore';

export class SignUpPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            errors: []
        }

        this._updateState = this._updateState.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }

    _updateState(e) {
        var key = e.target.id;
        var value = e.target.value;
        var keysToUpdate = {};
        keysToUpdate[key] = value;
        this.setState(keysToUpdate);
    }
    
    _onSubmit(e) {
        e.preventDefault();
        var that = this;
        return AxiosAPI.post('register', { username: that.state.username, password: that.state.password  })
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
                <Form onSubmit={ this._onSubmit } >
                    <h2>New Knowledge File Explorer: Register</h2>
                    
                    <label htmlFor="username">Email</label>
                    <input type="email" id="username" placeholder="Username" required onChange={ this._updateState } />
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="Password" required onChange={ this._updateState } />
                    <Button type="submit">Submit</Button>
                </Form>
            </div>
        )
    }
}