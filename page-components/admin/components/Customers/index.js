import React from 'react'
import { Card } from 'antd'

const Customers = () => {
  return (
    <Card title='Customers Management'>
      <div className='p-4'>
        <h3>Customers Component</h3>
        <p>This component will be loaded dynamically when selected.</p> 
      </div>
    </Card>
  )
}

export default Customers
