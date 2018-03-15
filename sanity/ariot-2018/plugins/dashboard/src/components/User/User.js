import React from 'react'
import styles from './User.css'

const User = ({name, tempPref, tablePref}) => {
  const {heightSitting, heightStanding} = tablePref;

  return (
    <div className={styles.user}>
      <p>{name}</p>
      <p>Temp. preference: {tempPref}</p>
      <p>Table preferences:</p>
      <p>Sitting: {heightSitting} cm.</p>
      <p>Standing: {heightStanding} cm.</p>
    </div>
  )
};

export default User
