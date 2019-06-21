import React from 'react';

import { withFirebase } from '../../Firebase';

const buttonStyle= {
  color: 'white',
  border: '1px solid white',
  marginTop:'2px',
  marginRight:'10px',
  float:'right',
}

const SignOutButton = ({ firebase }) => (
  <button type="button" style={buttonStyle} className="btn btn-default" onClick={firebase.doSignOut}>
    Sign Out
  </button>
);

export default withFirebase(SignOutButton);
