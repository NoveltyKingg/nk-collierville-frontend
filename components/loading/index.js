import React from 'react'
import { Triangle } from 'react-loader-spinner'

function Loading() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Triangle
        visible
        height='80'
        width='80'
        color='#b82431'
        ariaLabel='triangle-loading'
        wrapperStyle={{}}
        wrapperClass=''
      />
    </div>
  )
}

export default Loading
