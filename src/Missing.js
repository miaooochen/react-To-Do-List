import React from 'react'
import {Link} from 'react-router-dom'

const Missing = () => {
  return (
    <main className='Missing'>
      <h2>Page Not Found</h2>
      <Link to='/'>Vist Home Page</Link>  
    </main>
  )
}

export default Missing