import React from 'react';
import MultiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import styles from './Dashboard.css';
import UserList from "./container/UserList/UserList";
import Summary from "./container/Summary/Summary";
import Hours from "./container/Hours/Hours";
import PieWorkLoad from "./container/PieWorkLoad/PieWorkLoad";
import { Card, CardHeader, CardText, Toggle, Paper } from 'material-ui';
import classNames from 'classnames';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      partyMode: false,
      darthMode: false,
    };
  }

  render() {
    const dashStyle = [
      styles.container
    ];

    if (this.state.partyMode) {
      dashStyle.push(styles['party-mode']);
    }

    if (this.state.darthMode) {
      dashStyle.push(styles['darth-mode']);
    }

    return (
      <MultiThemeProvider>
        <div>
          <Card>
            <CardHeader
              title="(つ▀¯▀)つ"
              actAsExpander={true}
              showExpandableButton={true}
            />
            <CardText expandable={true}>
              <Toggle
                toggled={this.state.partyMode}
                onToggle={() => this.setState({ partyMode: !this.state.partyMode })}
                label={<span>🎉</span>}
                labelPosition="right"
              />
              <Toggle
                toggled={this.state.darthMode}
                onToggle={() => this.setState({ darthMode: !this.state.darthMode })}
                label={<span>🌟</span>}
                labelPosition="right"
              />
            </CardText>
          </Card>

          <div className={classNames(dashStyle)}>
            <h1>Great place to workSPACE</h1>

            <Paper className={styles.block}>
              <Summary />
            </Paper>

            <Paper className={styles.block}>
              <h3>List of users</h3>
              <UserList />
            </Paper>

            <div className={styles.flex}>
              <Paper className={styles.block}>
                <Hours
                  title="Total hours logged"
                  borderColor="rgba(255,99,132,1)"
                />
              </Paper>
              <Paper className={styles.block}>
                <Hours
                  title="Average hours logged"
                  borderColor="rgba(75,192,192,1)"
                  avg
                />
              </Paper>
            </div>
            <div className={styles.flex}>
              <Paper className={styles.block}>
                <PieWorkLoad />
              </Paper>
            </div>
          </div>
        </div>
      </MultiThemeProvider>
    )
  }
}

export default Dashboard
