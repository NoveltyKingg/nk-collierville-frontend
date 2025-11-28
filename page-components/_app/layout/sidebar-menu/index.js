import React, { useState, useMemo } from 'react'
import { Menu, Button, Dropdown, Space } from 'antd'
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
  MyOrdersIcon,
} from '@/assets/header'
import { NoveltyIcon } from '@/assets/common'
import { DownOutlined } from '@ant-design/icons'

const SideBarMenu = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [openAddNewStoreModal, setOpenAddNewStoreModal] = useState(false)

  const { noveltyData } = useGetContext()
  const { profile, general } = noveltyData || {}
  const { push } = useRouter()
  const { createLogin } = useCreateLogin()

  const toggleCollapse = () => setCollapsed((p) => !p)
  const toggleAddStore = () => setOpenAddNewStoreModal((s) => !s)

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

  const items = [
    {
      key: 'store',
      label: profile?.storeName || 'Select Store',
      disabled: true,
    },
    {
      type: 'divider',
    },
    ...(stores?.map((store) => ({
      key: `store-${store?.key}`,
      label: store?.label,
      icon: <ChangeStoreIcon />,
    })) || []),
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutIcon />,
    },
  ]

  const menuItems = useMemo(() => {
    const items = [
      { key: 'profile', icon: <ProfileIcon />, label: 'PROFILE' },
      { key: 'cart', icon: <CartIcon />, label: 'CART' },
      { key: 'addStore', icon: <AddNewStoreIcon />, label: 'ADD NEW STORE' },
      { key: 'home', label: 'HOME', icon: <HomeIcon /> },
      { key: 'myOrders', label: 'MY ORDERS', icon: <MyOrdersIcon /> },
    ]

    if (profile?.status === 'ADMIN') {
      items.unshift({ key: 'admin', icon: <AdminIcon />, label: 'ADMIN' })
    }

    return items
  }, [profile?.status])

  const onMenuClick = async ({ key }) => {
    if (key === 'admin') return routeGuard('/admin')
    if (key === 'profile')
      return routeGuard(`/${profile?.storeId || ''}/profile`)
    if (key === 'cart') return routeGuard(`/${profile?.storeId || ''}/cart`)
    if (key === 'home') return push('/')
    if (key === 'myOrders')
      return routeGuard(`/${profile?.storeId || ''}/my-orders`)
    if (key === 'addStore') return toggleAddStore()
    if (key === 'logout') return logout()

    if (key.startsWith('store-')) {
      const storeId = key.replace('store-', '')
      const token = getCookie('nk-collierville-token')
      await createLogin({ storeId, token })
      location.reload()
    }

    if (key.startsWith('subCategory-')) {
      const subCategoryId = key.replace('subCategory-', '')
      push(`/products?subCategory=${subCategoryId}`)
    }
  }

  const CATEGORY_ITEMS = general?.categories?.map((cat) => ({
    label: cat?.label,
    key: `category-${cat?.value}`,
    value: cat?.value,
    children: general?.subCategories
      ?.filter((sub) => sub?.cat_id === cat?.value)[0]
      ?.values?.map((item) => ({
        label: item?.label,
        key: `subCategory-${item?.value}`,
        value: item?.value,
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
          <div className='w-10 h-10 rounded-full bg-white grid place-items-center'>
            <NoveltyIcon />
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

      <div className='px-3 py-6 bg-[#38455e] border-[#f5f5f5] border-t text-white cursor-pointer align-center'>
        {profile?.isLoggedIn ? (
          <Dropdown menu={{ items, onClick: onMenuClick }}>
            <Space>
              {profile.storeName}
              <DownOutlined />
            </Space>
          </Dropdown>
        ) : (
          <Button
            onClick={() => push('/login')}
            className='w-full flex items-center gap-2 px-2 py-1.5'>
            <LoginIcon />
            {!collapsed && <span>LOGIN</span>}
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
