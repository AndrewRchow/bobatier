import React from 'react';
import classes from './account.module.css';

import { AuthUserContext } from '../../Session';
import { PasswordForgetForm } from '../../Partials/PasswordForget';
import  PasswordChangeForm  from '../../Partials/PasswordChange';
import { withAuthorization } from '../../Session';

const divStyle={
  margin: '15px',
}

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {login => (
      <div style={divStyle}>
        <h5>Account: {login.authUser.email}</h5>
        <PasswordForgetForm />
        {/* <PasswordChangeForm /> */}
      </div>
    )}
  </AuthUserContext.Consumer>
);

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(AccountPage);
