import React, { useEffect, useState } from 'react'
import SideBarMenu from './sidebar-menu'
import Footer from './footer'
import useGetAllWebCategories from '../hooks/useGetAllWebCategories'
import { Badge } from 'antd'
import {
  AddNewStoreIcon,
  AdminIcon,
  CartIcon,
  LogoutIcon,
  ProfileIcon,
} from '@/assets/header'
import { HomeIcon } from '@/assets/common'
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
    </div>
  </div>
)

const Layout = ({ children, layout }) => {
  const { getAllWebCategories } = useGetAllWebCategories()
  const [openAddNewStoreModal, setOpenAddNewStoreModal] = useState(false)

  const toggleAddStore = () => setOpenAddNewStoreModal((s) => !s)

  useEffect(() => {
    getAllWebCategories()
  }, [])

  return (
    <div className='min-h-screen flex flex-col bg-[#f5f5f5]'>
      <div className='flex flex-1 '>
        {layout && <SideBarMenu />}
        <div className='flex-1 min-w-0'>
          <main>{children}</main>
          {layout && <Footer />}
        </div>
      </div>

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
