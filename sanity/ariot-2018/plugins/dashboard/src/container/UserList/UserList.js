import React from 'react'
import {fetchPersons} from "../../forces/request";
import styles from './UserList.css'
import User from "../../components/User/User";

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {users: []};
  }

  componentDidMount() {
    fetchPersons().then(response => {
      this.setState({users: response})
    });
  }

  render() {
    console.log('USER LIST', this.state.users);

    return (
      <div className={styles["user-list"]}>
        <p>Dashboard is coming here (List of users).</p>
        {
          this.state.users.map(user =>
            <User
              key={user._id}
              name={user.name}
              tempPref={user.tempPreferences}
              tablePref={user.tablePreferences}
            />
          )
        }
      </div>
    )
  }
}

export default UserList
