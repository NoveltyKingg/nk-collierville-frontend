import React, { useEffect } from 'react'
import Header from './header'
import Footer from './footer'
import useGetAllWebCategories from '../hooks/useGetAllWebCategories'
import { Badge } from 'antd'
import useIsMobile from '@/utils/useIsMobile'
import useGetContext from '@/common/context/useGetContext'
import { useRouter } from 'next/router'
import { AdminIcon, CartIcon, LogoutIcon, ProfileIcon } from '@/assets/header'
import { HomeIcon } from '@/assets/common'
import setCookie from '@/utils/set-cookie'

const Layout = ({ children, layout }) => {
  const { getAllWebCategories } = useGetAllWebCategories()
  const { noveltyData } = useGetContext()
  const { profile } = noveltyData || {}
  const { isMobile } = useIsMobile()
  const { push } = useRouter()

  const handleCart = () => {
    if (profile?.isLoggedIn) {
      push(`/${profile?.storeId}/cart`)
    } else {
      push('/login')
    }
  }

  const logout = () => {
    setCookie('nk-collierville-token', 'expired', -1)
  }

  const handleRoute = (path) => {
    if (!noveltyData?.profile?.storeId) {
      push('/login')
    } else {
      push(path)
    }
  }

  useEffect(() => {
    getAllWebCategories()
  }, [])

  return (
    <div className='flex flex-col min-h-screen'>
      {layout && <Header />}
      <main className='flex-grow bg-[#f5f5f5]'>{children}</main>
      {layout && <Footer />}
      {isMobile && (
        <div className='sticky bottom-0 flex items-center justify-around bg-[#EAE0D5] py-3'>
          <HomeIcon
            style={{ fontSize: 24, color: '#000000' }}
            onClick={() => push('/')}
          />
          <AdminIcon onClick={() => handleRoute('/admin')} />
          <ProfileIcon
            onClick={() =>
              handleRoute(`/${noveltyData?.profile?.storeId}/profile`)
            }
          />
          <Badge dot={profile?.cartItems > 0}>
            <CartIcon onClick={handleCart} />
          </Badge>
          <LogoutIcon onClick={logout} />
        </div>
      )}
    </div>
  )
}

export default Layout
