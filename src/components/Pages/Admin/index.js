import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../../Firebase';

import { AuthUserContext } from '../../Session';
import { withAuthorization } from '../../Session';
import * as ROUTES from '../../../constants/routes';


class AdminPageBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  componentWillMount(){
    // this.props.history.push(ROUTES.LANDING);

  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }));

      this.setState({
        users: usersList,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    const {users, loading} = this.state;

    return (
      <div>

        {loading && <div>Loading...</div>}

        <UserList users={users} />
      </div>
    );
  }
}

const UserList = ({users}) => (
  <ul>
    {users.map(user => (
      <li key={user.uid}>
        <span>
          <strong>ID:</strong> {user.uid}
        </span>
        <span>
          <strong>E-Mail:</strong> {user.email}
        </span>
        <span>
          <strong>Username:</strong> {user.username}
        </span>
      </li>
    ))}
  </ul>
);

const authCondition = authUsera => !!authUsera;

const AdminPage = compose(
  withAuthorization(authCondition),
  withFirebase,
)(AdminPageBase);

export default AdminPage;