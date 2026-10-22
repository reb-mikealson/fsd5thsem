import React from 'react'
import { useContext, createContext } from 'react'

function myContext()
{
  const myname=createContext('arjun');
  const value=useContext(myname);
  return (
    <div>
      <h1>value from context is : {value}</h1>
    </div>
  )
}
export default App