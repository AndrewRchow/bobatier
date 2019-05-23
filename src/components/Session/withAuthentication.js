import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase/index';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
        role: null,
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        authUser => {
          console.log(authUser);
          if (authUser){
            this.setState({ authUser })
            this.props.firebase.user(authUser.uid).on('value', snapshot => {
              this.setState({ role: snapshot.val().role }) 
            });
          } else{
            this.setState({ authUser: null });  
            this.setState({ role: null });  
          }  
        },
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication;