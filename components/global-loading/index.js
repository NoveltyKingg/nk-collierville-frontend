import React from 'react'
import { Image } from 'antd'

function GlobalLoading() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        src='https://noveltykingmedia.s3.us-east-2.amazonaws.com/Homepage/NK+Collierville+loading.gif'
        alt='Loading...'
        preview={false}
        width='350px'
        height='350px'
      />
    </div>
  )
}

export default GlobalLoading
