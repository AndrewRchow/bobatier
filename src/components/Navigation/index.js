import React from 'react';
import classes from './navigation.module.css';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

import { AuthUserContext } from '../Session';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {login =>
        login.role ==='admin' ? <NavigationAuthAdmin /> : 
        (login.authUser ? <NavigationAuth /> : <NavigationNonAuth />)
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuthAdmin = () => (
  <div className={classes.horizontal}>
      <Link to={ROUTES.LANDING}>Landing</Link>
      <Link to={ROUTES.REVIEWS}>Reviews</Link>
      <Link to={ROUTES.HOME}>Home</Link>
      <Link to={ROUTES.ACCOUNT}>Account</Link>
      <Link to={ROUTES.ADMIN}>Admin</Link>
      <SignOutButton />
  </div>
);

const NavigationAuth = () => (
  <div className={classes.horizontal}>
      <Link to={ROUTES.LANDING}>Landing</Link>
      <Link to={ROUTES.REVIEWS}>Reviews</Link>
      <Link to={ROUTES.HOME}>Home</Link>
      <Link to={ROUTES.ACCOUNT}>Account</Link>
      <SignOutButton />
  </div>
);

const NavigationNonAuth = () => (
  <div className={classes.horizontal}>
      <Link to={ROUTES.LANDING}>Landing</Link>
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
  </div>
);

export default Navigation;
