import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PasswordMask from 'react-password-mask';

import classes from './signUp.module.css';
import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';

const signUpPageStyle = {
    margin: "10px"
}

const SignUpPage = () => (
    <div style={signUpPageStyle}>
        <h5> Sign Up </h5>
        <SignUpForm />
    </div>
);

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    error: null,
};

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { username, email, passwordOne } = this.state;

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {

                return this.props.firebase
                    .user(authUser.user.uid)
                    .set({
                        username,
                        email,
                    });
            })
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(process.env.PUBLIC_URL + ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {
        const formStyle = {
            margin: "10px",
            padding: "10px"
        }

        const {
            username,
            email,
            passwordOne,
            error,
        } = this.state;

        const isInvalid =
            passwordOne === '' ||
            email === '' ||
            username === '';

        return (
            <form onSubmit={this.onSubmit}>
                <input name="username"
                    value={username}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Name"
                    className={classes.inputStyle} />
                <input name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                    className={classes.inputStyle} />
                <PasswordMask name="passwordOne"
                    placeholder="Password"
                    value={passwordOne}
                    onChange={this.onChange}
                    buttonClassName={classes.maskButton}
                    inputClassName={classes.inputStyle} />

                <button disabled={isInvalid}
                    className="btn btn-primary"
                    type="submit" >
                    Sign Up
                </button>

                {error && <p className={classes.error}> {error.message} </p>}
            </form>
        );
    }
}

const SignUpLink = () => (
    <p>
        Don 't have an account? <Link to={process.env.PUBLIC_URL + ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export default SignUpPage;

export { SignUpForm, SignUpLink };