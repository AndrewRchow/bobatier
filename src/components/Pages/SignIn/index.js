import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import PasswordMask from 'react-password-mask';

import classes from './signIn.module.css';
import { SignUpLink } from '../../Partials/SignUp';
import { PasswordForgetLink } from '../../Partials/PasswordForget';
import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';

const signInPageStyle = {
  margin:"20px"
}
const SignInPage = () => (
  <div style={signInPageStyle}>
    <h5>Sign In</h5>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    const signInButtonStyle = {
      marginTop:"8px",
    }

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
          className={classes.inputStyle}
        />
        <PasswordMask
          name="password"
          placeholder="Password"
          value={password}
          onChange={this.onChange}
          buttonClassName={classes.maskButton}
          inputClassName={classes.inputStyle}
        />
        <button className={`btn btn-primary`}  style={signInButtonStyle} disabled={isInvalid} type="submit">
          Sign In
        </button>

        {error && <p className={classes.error}>{error.message}</p>}
      </form>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };
