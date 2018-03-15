import React from 'react'
import styles from './Dashboard.css'
import UserList from "./container/UserList/UserList";
import Summary from "./container/Summary/Summary";

class Dashboard extends React.Component {
  render() {
    return (
      <div className={styles.dashboard}>
        <h1>Great place to workSPACE</h1>
        <Summary/>
        <UserList/>
      </div>
    )
  }
}

export default Dashboard