import React from 'react'
import styles from './User.css'
import { Card, CardHeader, CardText } from 'material-ui';

const calcTime = (range) => {
  let sum = 0;

  if (range == null) {
    return sum;
  }

  range.forEach(time => {
    const from = new Date(time.from);
    const to = new Date(time.to);
    sum += (to - from) / 3600000;
  });

  return sum.toFixed(2);
};

const User = ({ name, tempPref, tablePref, hours }) => {
  const { heightSitting, heightStanding } = tablePref;

  return (
    <Card>
      <CardHeader
        title={name}
        subtitle={calcTime(hours) + " hours"}
        actAsExpander={true}
        showExpandableButton={true}
      />
      <CardText expandable={true}>
        <p>
          <strong>Temp. preference:</strong> {tempPref} &deg;C<br />
          <strong>Sitting:</strong> {heightSitting} cm <br />
          <strong>Standing:</strong> {heightStanding} cm <br />
          <strong>Hours:</strong> {calcTime(hours)}
        </p>
      </CardText>
    </Card>
  )
};

export default User
