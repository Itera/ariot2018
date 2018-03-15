import React from 'react'
import styles from './User.css'

const calcTime = (range) => {
  let sum = 0;

  if(range == null){
    return sum;
  }

  range.forEach(time => {
    const from = new Date(time.from);
    const to = new Date(time.to);
    sum += (to - from)/3600000;
  });

  return sum.toFixed(2);
};

const User = ({name, tempPref, tablePref, hours}) => {
  const {heightSitting, heightStanding} = tablePref;

  return (
    <div className={styles.user}>
      <div className={styles.title}>{name}</div>
      <p>Temp. preference: {tempPref} &deg;C</p>
      <div>
        <p className={styles.underline}>Table preferences:</p>
        <p>Sitting: {heightSitting} cm.</p>
        <p>Standing: {heightStanding} cm.</p>
      </div>
      <p>Hours: {calcTime(hours)}</p>
    </div>
  )
};

export default User
