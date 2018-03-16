import React from 'react'
import {fetchSummary} from "../../forces/request";
import styles from './Summary.css'
import { GridList, GridTile, Paper } from 'material-ui';

class Summary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      summary: {
        users: null,
        tempPreferences: null,
        tablePreferencesStanding: null,
        tablePreferencesSitting: null
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
    return arr && (arr.reduce(reducer)/arr.length).toFixed(2);
  }

  render() {
    const {users, tempPreferences, tablePreferencesStanding, tablePreferencesSitting} = this.state.summary;

    const paperStyle = {
      padding: "10px",
      margin: "10px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      justifyContent: "space-between",
      borderRadius: "5px"
    };

    const papers = [
      {text: "Average temp.", number: this.avg(tempPreferences), color: "#4EBAD1"},
      {text: "Average standing height", number: this.avg(tablePreferencesStanding), color: "#9989c4"},
      {text: "Average sitting height", number: this.avg(tablePreferencesSitting), color: "#89bf8a"},
      {text: "Number of users", number: users, color: "#db749b"}
    ];

    const items = papers.map(({text, number, color}, index) =>
      <div key={text} style={{width: "250px"}}>
        <Paper style={Object.assign({}, paperStyle, {backgroundColor: color})} key={index}>
          <div className="header">{text}</div>
          <div style={{fontSize: "36pt", verticalAlign: "middle"}}>{number}</div>
        </Paper>
      </div>
    );

    return (
      <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-around"}}>
        {items}
      </div>
    )
  }
}

export default Summary
