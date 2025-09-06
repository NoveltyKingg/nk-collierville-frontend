import React from 'react'
import { Button } from 'antd'
import { useRouter } from 'next/router'
import { Image } from 'antd'

function OrderCompletion() {
  const { push } = useRouter()

  return (
    <div>
      <Image
        src='https://noveltykingmedia.s3.us-east-2.amazonaws.com/Homepage/order+place.gif'
        alt='Loading...'
        width='100%'
      />
      <div style={{ fontSize: '18px', fontWeight: '700' }}>
        You order has been placed successfully, one of our executive will call
        you shortly
      </div>
      <Button onClick={() => push('/')} type='primary'>
        Return to Home
      </Button>
    </div>
  )
}

export default OrderCompletion
