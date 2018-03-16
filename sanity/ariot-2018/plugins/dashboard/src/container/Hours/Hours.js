import React from 'react'
import { fetchHours } from "../../forces/request";
import { Line } from "react-chartjs-2";
import styles from './Hours.css'

const calcHours = (response, avg, borderColor) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let data = new Array(7).fill(0);

  response.forEach(person => {
    if (Object.keys(person).length > 0) {
      person.hours.forEach(time => {
        const from = new Date(time.from);
        const to = new Date(time.to);

        if (avg) {
          data[from.getDay()] += (to - from) / 3600000 / response.length;
        } else {
          data[from.getDay()] += (to - from) / 3600000;
        }
      })
    }
  });

  return {
    labels: days,
    datasets: [{
      fill: false,
      data,
      borderColor,
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderWidth: 5,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
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
      this.setState({ data: calcHours(response, this.props.avg, this.props.borderColor) });
    });
  }

  render() {
    const { data } = this.state;
    console.log(data);
    return (
      <div>
        <h3>{this.props.title}</h3>
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
