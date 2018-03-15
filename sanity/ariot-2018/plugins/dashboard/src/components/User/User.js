import React from 'react'
import styles from './User.css'

const User = ({name, tempPref, tablePref}) => {
  const {heightSitting, heightStanding} = tablePref;

  return (
    <div className={styles.user}>
      <div className={styles.title}>{name}</div>
      <p>Temp. preference: {tempPref} &deg;C</p>
      <div className={styles["table-pref"]}>
        Table preferences:
      </div>
      <p>Sitting: {heightSitting} cm.</p>
      <p>Standing: {heightStanding} cm.</p>
    </div>
  )
};

export default User
