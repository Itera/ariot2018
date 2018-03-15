import React from 'react'
import {fetchSummary} from "../../forces/request";
import styles from './Summary.css'

class Summary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      summary: {
        users: null,
        tempPreferences: null,
        tablePreferencesStanding: null,
        tablePreferencesSitting: null,
      }
    };
  }

  componentDidMount() {
    fetchSummary().then(response => {
      this.setState({summary: response})
    });
  }

  avg(arr){
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    return arr && arr.reduce(reducer)/arr.length;
  }

  render() {
    const {users, tempPreferences, tablePreferencesStanding, tablePreferencesSitting} = this.state.summary;

    return (
      <div className={styles.summary}>
        <div>Number of users: {users}</div>
        <div>Average temperature preference: {this.avg(tempPreferences)} &deg;C</div>
        <div>Average standing height: {this.avg(tablePreferencesStanding)} cm</div>
        <div>Average sitting height: {this.avg(tablePreferencesSitting)} cm</div>
      </div>
    )
  }
}

export default Summary
