import React from 'react';
import classes from './navigation.module.css';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

import { AuthUserContext } from '../Session';

const authAdminMenuItems = [
  ['Landing', ROUTES.LANDING],
  ['Reviews', ROUTES.REVIEWS],
  ['Home', ROUTES.HOME],
  ['Account', ROUTES.ACCOUNT],
  ['Admin', ROUTES.ADMIN],
];

const authMenuItems = [
  ['Landing', ROUTES.LANDING],
  ['Reviews', ROUTES.REVIEWS],
  ['Home', ROUTES.HOME],
  ['Account', ROUTES.ACCOUNT],
];

const nonAuthMenuItems = [
  ['Landing', ROUTES.LANDING],
  ['Sign In', ROUTES.SIGN_IN],
];


const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {login =>
        login.role === 'admin' ? <NavigationAuth menuItems={authAdminMenuItems} signedIn={true} /> :
          (login.authUser ? <NavigationAuth menuItems={authMenuItems} signedIn={true} /> :
            <NavigationAuth menuItems={nonAuthMenuItems} signedIn={false} />)
      }
    </AuthUserContext.Consumer>
  </div>
);

class NavigationAuth extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: ''
    }
  }

  render() {
    let signoutButton = null;
    if (this.props.signedIn) {
      signoutButton = <SignOutButton />
    } 
    return (
      <div className='menu'>
        {this.props.menuItems.map(([menuItem, route]) =>
          <Link key={menuItem} to={route}
            className={window.location.pathname === route ? classes.active : ""}>
            {menuItem}
          </Link>
        )}
        {signoutButton}
      </div>
    );
  }
}

// const NavigationAuthAdmin = () => (
//   <div className={classes.horizontal}>
//     <Link to={ROUTES.LANDING}>Landing</Link>
//     <Link to={ROUTES.REVIEWS}>Reviews</Link>
//     <Link to={ROUTES.HOME}>Home</Link>
//     <Link to={ROUTES.ACCOUNT}>Account</Link>
//     <Link to={ROUTES.ADMIN}>Admin</Link>
//     <SignOutButton />
//   </div>
// );

// const NavigationAuth = () => (
//   <div className={classes.horizontal}>
//       <Link to={ROUTES.LANDING}>Landing</Link>
//       <Link to={ROUTES.REVIEWS}>Reviews</Link>
//       <Link to={ROUTES.HOME}>Home</Link>
//       <Link to={ROUTES.ACCOUNT}>Account</Link>
//       <SignOutButton />
//   </div>
// );

// const NavigationNonAuth = () => (
//   <div className={classes.horizontal}>
//     <Link to={ROUTES.LANDING}>Landing</Link>
//     <Link to={ROUTES.SIGN_IN}>Sign In</Link>
//   </div>
// );

export default Navigation;
