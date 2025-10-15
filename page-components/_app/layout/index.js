import React, { useEffect, useState } from 'react'
import Header from './header'
import Footer from './footer'
import useGetAllWebCategories from '../hooks/useGetAllWebCategories'
import useGetContext from '@/common/context/useGetContext'
import useIsMobile from '@/utils/useIsMobile'
import { useRouter } from 'next/router'
import { Badge } from 'antd'
import {
  AddNewStoreIcon,
  AdminIcon,
  CartIcon,
  LogoutIcon,
  ProfileIcon,
} from '@/assets/header'
import { HomeIcon } from '@/assets/common'
import setCookie from '@/utils/set-cookie'
import AddNewStore from './add-new-store'

const MobileDock = ({
  onHome,
  onAdmin,
  onAddStore,
  onProfile,
  onCart,
  onLogout,
  cartDot = false,
}) => (
  <div className='sticky bottom-0 z-[60]'>
    {/* gradient border top */}
    <div className='h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent' />
    <div className='backdrop-blur bg-[#EAE0D5]/95 border-t border-black/10 px-5 py-3'>
      <div className='flex items-center justify-between max-w-[680px] mx-auto'>
        <button
          aria-label='Home'
          onClick={onHome}
          className='p-2 rounded-xl hover:bg-black/5 transition'>
          <HomeIcon style={{ fontSize: 22, color: '#222' }} />
        </button>
        <button
          aria-label='Admin'
          onClick={onAdmin}
          className='p-2 rounded-xl hover:bg-black/5 transition'>
          <AdminIcon />
        </button>
        <button
          aria-label='Add store'
          onClick={onAddStore}
          className='p-2 rounded-xl hover:bg-black/5 transition'>
          <AddNewStoreIcon />
        </button>
        <button
          aria-label='Profile'
          onClick={onProfile}
          className='p-2 rounded-xl hover:bg-black/5 transition'>
          <ProfileIcon />
        </button>
        <Badge dot={cartDot}>
          <button
            aria-label='Cart'
            onClick={onCart}
            className='p-2 rounded-xl hover:bg-black/5 transition'>
            <CartIcon />
          </button>
        </Badge>
        <button
          aria-label='Logout'
          onClick={onLogout}
          className='p-2 rounded-xl hover:bg-black/5 transition'>
          <LogoutIcon />
        </button>
      </div>
      {/* safe-area on iOS */}
      <div className='h-[env(safe-area-inset-bottom)]' />
    </div>
  </div>
)

const Layout = ({ children, layout }) => {
  const { getAllWebCategories } = useGetAllWebCategories()
  const { noveltyData } = useGetContext()
  const { profile } = noveltyData || {}
  const { isMobile } = useIsMobile()
  const { push } = useRouter()
  const [openAddNewStoreModal, setOpenAddNewStoreModal] = useState(false)

  const toggleAddStore = () => setOpenAddNewStoreModal((s) => !s)

  const logout = () => {
    setCookie('nk-collierville-token', 'expired', -1)
  }

  const routeGuard = (path) => {
    if (!noveltyData?.profile?.storeId) push('/login')
    else push(path)
  }

  const goCart = () =>
    profile?.isLoggedIn ? push(`/${profile?.storeId}/cart`) : push('/login')

  useEffect(() => {
    getAllWebCategories()
  }, [])

  return (
    <div className='min-h-screen flex flex-col bg-[#f5f5f5]'>
      {layout && <Header />}
      <main className='flex-1 pt-[1px]'>
        <div className='mx-auto w-full'>{children}</div>
      </main>
      {layout && <Footer />}
      {layout && isMobile && (
        <MobileDock
          onHome={() => push('/')}
          onAdmin={() => routeGuard('/admin')}
          onAddStore={toggleAddStore}
          onProfile={() =>
            routeGuard(`/${noveltyData?.profile?.storeId}/profile`)
          }
          onCart={goCart}
          onLogout={logout}
          cartDot={profile?.cartItems > 0}
        />
      )}
      {openAddNewStoreModal && (
        <AddNewStore
          openAddStore={openAddNewStoreModal}
          handleClose={toggleAddStore}
        />
      )}
    </div>
  )
}

export default Layout
