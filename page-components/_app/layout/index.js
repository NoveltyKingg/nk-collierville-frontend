import React, { useEffect, useMemo, useState } from 'react'
import { Divider, Button } from 'antd'
import SideBarMenu from './sidebar-menu'
import Footer from './footer'
import useGetAllWebCategories from '../hooks/useGetAllWebCategories'
import AddNewStore from './add-new-store'
import useIsMobile from '@/utils/useIsMobile'
import MobileFooter from './mobile-footer'
import MobileHeader from './mobile-header'
import setCookie from '@/utils/set-cookie'
import { useRouter } from 'next/router'
import useGetContext from '@/common/context/useGetContext'

const Layout = ({ children, layout }) => {
  const { getAllWebCategories } = useGetAllWebCategories()
  const [openAddNewStoreModal, setOpenAddNewStoreModal] = useState(false)
  const { isMobile } = useIsMobile()
  const { push } = useRouter()
  const { noveltyData } = useGetContext()
  const { profile } = noveltyData || {}

  const toggleAddStore = () => setOpenAddNewStoreModal((s) => !s)

  const logout = () => {
    setCookie('nk-collierville-token', 'expired', -1)
    push('/login')
  }

  useEffect(() => {
    getAllWebCategories()
  }, [])

  return (
    <div className='min-h-screen flex flex-col bg-[#f5f5f5]'>
      {layout && isMobile && (
        <div className='sticky top-0 z-50'>
          <MobileHeader profile={profile} />
        </div>
      )}

      <div className='flex flex-1'>
        {layout && !isMobile && <SideBarMenu />}
        <div className='flex-1 min-w-0'>
          <main>{children}</main>
          {layout && <Footer />}
          {isMobile && layout && (
            <MobileFooter
              profile={profile}
              onAddStore={toggleAddStore}
              onLogout={logout}
            />
          )}
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
