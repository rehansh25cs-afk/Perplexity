import React, { useState } from 'react'
import { MoonLoader } from 'react-spinners'

const Test = () => {

    const [loading, setloading] = useState(false)

  return (
    <div>
        <button onClick={()=>{setloading(!loading)}}>Toggle Loading</button>
      <MoonLoader size={18} loading={loading} color="black" />
    </div>
  )
}

export default Test
