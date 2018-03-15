import React from 'react'
import {fetchHours} from "../../forces/request";
import {Line} from "react-chartjs-2";
import styles from './Hours.css'

const calcHours = (response) => {

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let data = new Array(7).fill(0);

  response.forEach(person => {
    if (Object.keys(person).length > 0) {
      person.hours.forEach(time => {
        const from = new Date(time.from);
        const to = new Date(time.to);
        data[from.getDay()] += ((to - from)/3600000).toFixed(2);
      })
    }
  });

  return {
    labels: days,
    datasets: [{
      fill: false,
      data: data,
      borderColor: "#000000"
    }]
  };
};

class Hours extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {}
    }
  }

  componentDidMount() {
    fetchHours().then(response => {
      this.setState({data: calcHours(response)});
    });
  }

  render() {
    console.log(this.state.data);
    const { data } = this.state;
    return (
      <div style={{padding: "20px"}}>
        <Line
          data={data}
          options={{
            legend: {
              display: false
            }
          }}
        />
      </div>
    );
  }
}

export default Hours;
