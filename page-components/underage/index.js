import React from 'react'
import { Image } from 'antd'

const UnderAge = () => {
  return (
    <div>
      <Image
        src='https://noveltykingmedia.s3.us-east-2.amazonaws.com/Homepage/under-21-not-allowed-prohibition-sign-no-symbol-vector-39257151.webp'
        alt='Loading...'
        preview={false}
      />
      <div>Under Age 18</div>
      <div>Sorry, you must be at least 18 years old to use this website.</div>
    </div>
  )
}

export default UnderAge
