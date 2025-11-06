import React from 'react'
import { Button, Image } from 'antd'
import { useRouter } from 'next/router'

function MobileHeader({ profile }) {
  const { push } = useRouter()

  return (
    <header className='flex items-center justify-between bg-[#38455e] px-3 py-2'>
      <div className='flex items-center gap-3'>
        <Image
          src='https://noveltykingmedia.s3.us-east-2.amazonaws.com/Homepage/NK+App+logo.png'
          preview={false}
          onClick={() => push('/')}
          width={60}
          className='cursor-pointer'
          alt='Loading...'
        />
      </div>
      <div>
        {!profile?.isLoggedIn && (
          <Button size='small' onClick={() => push('/login')}>
            Login
          </Button>
        )}
      </div>
    </header>
  )
}

export default MobileHeader
