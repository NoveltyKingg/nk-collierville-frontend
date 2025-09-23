import React from 'react'
import { Button, Image } from 'antd'
import { useRouter } from 'next/router'

export default function OrderCompletion() {
  const { push } = useRouter()
  return (
    <div className='mx-auto max-w-2xl p-4 text-center space-y-4'>
      <Image
        src='https://noveltykingmedia.s3.us-east-2.amazonaws.com/Homepage/order+place.gif'
        alt='Loading...'
        width='100%'
        preview={false}
      />
      <div className='text-base font-semibold'>
        You order has been placed successfully, one of our executive will call
        you shortly
      </div>
      <Button onClick={() => push('/')} type='primary'>
        Return to Home
      </Button>
    </div>
  )
}
