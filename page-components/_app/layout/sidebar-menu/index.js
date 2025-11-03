import React, { useState, useMemo } from 'react'
import { Menu, Button } from 'antd'
import { useRouter } from 'next/router'
import useGetContext from '@/common/context/useGetContext'
import { getCookie } from '@/utils/get-cookie'
import setCookie from '@/utils/set-cookie'
import useCreateLogin from '../../hooks/useCreateLogin'
import AddNewStore from '../add-new-store'
import {
  AdminIcon,
  ProfileIcon,
  LogoutIcon,
  CartIcon,
  AddNewStoreIcon,
  ChangeStoreIcon,
  LoginIcon,
  HomeIcon,
} from '@/assets/header'

const SideBarMenu = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [openAddNewStoreModal, setOpenAddNewStoreModal] = useState(false)

  const { noveltyData } = useGetContext()
  const { profile, general } = noveltyData || {}
  const { push } = useRouter()
  const { createLogin } = useCreateLogin()

  const toggleCollapse = () => setCollapsed((p) => !p)
  const toggleAddStore = () => setOpenAddNewStoreModal((s) => !s)

  console.log(noveltyData, 'noveltyData')

  const logout = () => {
    setCookie('nk-collierville-token', 'expired', -1)
    push('/login')
  }

  const routeGuard = (path) => (!profile?.storeId ? push('/login') : push(path))

  const stores =
    Object.entries(profile?.stores || {})
      ?.map(([key, value]) =>
        profile?.storeId !== Number(key) ? { label: value, key } : undefined,
      )
      .filter(Boolean) || []

  const menuItems = useMemo(
    () => [
      { key: 'admin', icon: <AdminIcon />, label: 'ADMIN' },
      { key: 'profile', icon: <ProfileIcon />, label: 'PROFILE' },
      { key: 'cart', icon: <CartIcon />, label: 'CART' },
      { key: 'addStore', icon: <AddNewStoreIcon />, label: 'ADD NEW STORE' },
      { key: 'home', label: 'HOME', icon: <HomeIcon /> },
      {
        key: 'changeStore',
        icon: <ChangeStoreIcon />,
        label: 'CHANGE STORE',
        children:
          stores?.length > 0
            ? stores.map((s) => ({
                key: `store-${s.key}`,
                label: s.label,
              }))
            : null,
      },
    ],
    [stores],
  )

  const onMenuClick = async ({ key }) => {
    if (key === 'admin') return routeGuard('/admin')
    if (key === 'profile')
      return routeGuard(`/${profile?.storeId || ''}/profile`)
    if (key === 'cart') return routeGuard(`/${profile?.storeId || ''}/cart`)
    if (key === 'home') return push('/')
    if (key === 'addStore') return toggleAddStore()

    if (key.startsWith('store-')) {
      const storeId = key.replace('store-', '')
      const token = getCookie('nk-collierville-token')
      await createLogin({ storeId, token })
      location.reload()
    }
  }

  const CATEGORY_ITEMS = general?.categories?.map((item) => ({
    label: item?.label,
    key: `category - ${item?.value}`,
    type: 'category',
    children: general?.subCategories
      ?.filter((sub) => sub?.cat_id === item?.value)[0]
      ?.values.map((subItem) => ({
        label: subItem?.label,
        key: `subCategory - ${subItem?.value}`,
        type: 'subCategory',
      })),
  }))

  return (
    <aside
      className={
        'sticky top-0 self-start flex flex-col transition-all duration-200 max-w-[240px] h-screen'
      }>
      <div className='flex items-center justify-between gap-2 px-3 py-3 bg-[#38455e] border-b border-[#f5f5f5]'>
        <button
          onClick={toggleCollapse}
          className='flex items-center gap-2 overflow-hidden'>
          <div className='w-9 h-9 rounded-full bg-white grid place-items-center'>
            <span className='text-[12px] font-bold'>NK</span>
          </div>
          {!collapsed && (
            <span className='font-semibold tracking-wide text-white'>
              Novelty King
            </span>
          )}
        </button>
      </div>

      <Menu
        items={[...menuItems, ...(CATEGORY_ITEMS || [])]}
        mode='inline'
        inlineCollapsed={collapsed}
        className='flex-1 overflow-auto !bg-[#38455e] !text-white'
        onClick={onMenuClick}
      />

      <div className='p-3 bg-[#38455e] border-[#f5f5f5] border-t'>
        {profile?.isLoggedIn ? (
          <Button
            onClick={logout}
            className='w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-black/5'>
            <LogoutIcon />
            {!collapsed && <span>Logout</span>}
          </Button>
        ) : (
          <Button
            onClick={() => push('/login')}
            className='w-full flex items-center gap-2 px-2 py-1.5 !text-white'>
            <LoginIcon />
            {!collapsed && <span className='!text-white'>Login</span>}
          </Button>
        )}
      </div>

      {openAddNewStoreModal && (
        <AddNewStore
          openAddStore={openAddNewStoreModal}
          handleClose={toggleAddStore}
        />
      )}
    </aside>
  )
}

export default SideBarMenu
