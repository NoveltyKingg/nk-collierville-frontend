import React from 'react'
import { Card } from 'antd'

const AllProducts = () => {
  return (
    <Card title='All Products Management'>
      <div className='p-4'>
        <h3>All Products Component</h3>
        <p>This component will be loaded dynamically when selected.</p> 
      </div>
    </Card>
  )
}

export default AllProducts
