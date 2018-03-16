import React from 'react'
import { fetchPersons } from "../../forces/request";
import { Doughnut } from 'react-chartjs-2';

const calcHours = (response) => {
  const names = response.map(person => person.name);
  let data = new Array(names.length).fill(0);

  response.map((person, i) => {
    let personHours = 0;

    if (person.hours && person.hours.length > 0) {
      person.hours.map(time => {
        const from = new Date(time.from);
        const to = new Date(time.to);
        personHours += (to - from) / 3600000;
      });
    }

    data[i] = personHours;
  });


  return {
    labels: names,
    datasets: [{
      data,
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56'
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56'
      ]
    }]
  };
};

class PieWorkLoad extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {}
    }
  }

  componentDidMount() {
    fetchPersons().then(response => {
      this.setState({ data: calcHours(response) });
    });
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        <h3>Employee Total Hours</h3>
        <Doughnut data={data} />
      </div>
    );
  }
}

export default PieWorkLoad;
