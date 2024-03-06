import React, { useContext, useEffect, useState } from 'react'
import { authentication } from '../App';

const Dashboard = () => {
  const { logedUser, setLogedUser } = useContext(authentication)
  return (
    <div>Welcome {logedUser.displayName}</div>
  )
}

export default Dashboard