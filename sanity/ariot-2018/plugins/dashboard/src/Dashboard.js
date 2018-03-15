import React from 'react';
import MultiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import styles from './Dashboard.css';
import UserList from "./container/UserList/UserList";
import Summary from "./container/Summary/Summary";
import Hours from "./container/Hours/Hours";

class Dashboard extends React.Component {
  render() {
    return (
      <MultiThemeProvider>
        <div className={styles.container}>
          <h1>Great place to workSPACE</h1>
          <Summary/>
          <h3>List of users</h3>
          <UserList/>
          <h3>Hours logged this week</h3>
          <Hours/>
        </div>
      </MultiThemeProvider>
    )
  }
}

export default Dashboard
