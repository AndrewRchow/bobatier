import React from 'react';
import classes from './navigation.module.css';
import { Link } from 'react-router-dom';
import SignOutButton from '../Partials/SignOut';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

const authAdminMenuItems = [
  ['Tier List', process.env.PUBLIC_URL + ROUTES.LANDING],
  ['Recent Reviews', process.env.PUBLIC_URL + ROUTES.REVIEWS],
  ['My Reviews', process.env.PUBLIC_URL + ROUTES.HOME],
  ['Account', process.env.PUBLIC_URL + ROUTES.ACCOUNT],
  ['Admin', process.env.PUBLIC_URL + ROUTES.ADMIN],
];

const authMenuItems = [
  ['Tier List', process.env.PUBLIC_URL + ROUTES.LANDING],
  ['Recent Reviews', process.env.PUBLIC_URL + ROUTES.REVIEWS],
  ['My Reviews', process.env.PUBLIC_URL + ROUTES.HOME],
  ['Account', process.env.PUBLIC_URL + ROUTES.ACCOUNT],
];

const nonAuthMenuItems = [
  ['Tier List', process.env.PUBLIC_URL + ROUTES.LANDING],
  ['Recent Reviews', process.env.PUBLIC_URL + ROUTES.REVIEWS],
  ['Sign In', process.env.PUBLIC_URL + ROUTES.SIGN_IN],
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
      active: '',
      barsOpen: false,
    }
  }

  barsClick = () => {
    this.setState({ barsOpen: !this.state.barsOpen })
  }

  render() {
    let barsOpen = this.state.barsOpen;
    let signoutButton = null;
    if (this.props.signedIn) {
      signoutButton = <SignOutButton />
    }

    return (
      <div className={`${(barsOpen ? classes.responsive : "")} ${classes.navbar}`}>
        {this.props.menuItems.map(([menuItem, route]) =>
          <Link key={menuItem} to={route} onClick={this.barsClick}
            className={window.location.pathname === route ? classes.active : ""}>
            {menuItem}
          </Link>
        )}
        <div className={`${(barsOpen ? classes.responsiveSignout : "")}`} onClick={this.barsClick}>
          {signoutButton}
        </div>


        <a className={`${classes.icon}`} onClick={this.barsClick}>
          <FontAwesomeIcon icon={faBars} size="lg" />
        </a>
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
