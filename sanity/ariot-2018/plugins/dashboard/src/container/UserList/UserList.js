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
    return (
      <div className={styles["user-list"]}>
        {
          this.state.users.map(user =>
            <User
              key={user._id}
              name={user.name}
              tempPref={user.tempPreferences}
              tablePref={user.tablePreferences}
              hours={user.hours}
            />
          )
        }
      </div>
    )
  }
}

export default UserList
