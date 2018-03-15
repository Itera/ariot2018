import React from 'react'
import {fetchSummary} from "../../forces/request";
import styles from './Summary.css'

class Summary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {summary: []};
  }

  componentDidMount() {
    fetchSummary().then(response => {
      this.setState({summary: response})
    });
  }

  render() {
    console.log('SUMMARY', this.state.summary);

    return (
      <div className={styles.summary}>
        <p>Summary.</p>
        {
          this.state.summary.map(info =>
            <p>{info.name}</p>
          )
        }
      </div>
    )
  }
}

export default Summary
