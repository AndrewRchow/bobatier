import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import classes from './app.module.css';

import Navigation from '../Navigation';
import LandingPage from '../Pages/Landing';
import SignUpPage from '../Partials/SignUp';
import SignInPage from '../Pages/SignIn';
import PasswordForgetPage from '../Partials/PasswordForget';
import HomePage from '../Pages/Home';
import ReviewsPage from '../Pages/Reviews';
import AccountPage from '../Pages/Account';
import AdminPage from '../Pages/Admin';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

const App = () => (
  <Router>
    <div>
      <div>
        <Navigation />
        <hr />
      </div>
      <div className={classes.main}>
        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route exact path={ROUTES.HOME} component={HomePage} />
        <Route exact path={ROUTES.REVIEWS} component={ReviewsPage} />
        <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
        <Route exact path={ROUTES.ADMIN} component={AdminPage} />
        <Route
          exact
          path={ROUTES.PASSWORD_FORGET}
          component={PasswordForgetPage}
        />
      </div>
    </div>
  </Router>
);

export default withAuthentication(App);
