import React from 'react'
import { Button } from 'antd'
import {
  AddNewStoreIcon,
  AdminIcon,
  CartIcon,
  LogoutIcon,
  ProfileIcon,
  HomeIcon,
} from '@/assets/mobile'
import { useRouter } from 'next/router'

const MobileFooter = ({
  cartDot,
  onLogout = () => {},
  onAddStore = () => {},
  profile,
}) => {
  const { push } = useRouter()
  const routeGuard = (path) => (!profile?.storeId ? push('/login') : push(path))

  const MOBILE_FOOTER_BUTTONS = [
    {
      key: 'home',
      icon: <HomeIcon style={{ fontSize: 22, color: '#222' }} />,
      onClick: () => push('/'),
    },

    ...(profile?.status === 'ADMIN'
      ? [
          {
            key: 'admin',
            icon: <AdminIcon />,
            onClick: () => routeGuard('/admin'),
          },
        ]
      : []),

    {
      key: 'addStore',
      icon: <AddNewStoreIcon />,
      onClick: () => onAddStore(),
    },
    {
      key: 'profile',
      icon: <ProfileIcon />,
      onClick: () => routeGuard(`/${profile?.storeId || ''}/cart`),
    },
    {
      key: 'cart',
      icon: <CartIcon />,
      onClick: () => routeGuard(`/${profile?.storeId || ''}/cart`),
    },
    {
      key: 'logout',
      icon: <LogoutIcon />,
      onClick: () => onLogout(),
    },
  ]

  return (
    <div className='sticky bottom-0 z-[60]'>
      <div className='backdrop-blur bg-[#EAE0D5]/95 border-t border-black/10 px-5 py-3'>
        <div className='flex items-center justify-between max-w-[680px] mx-auto'>
          {MOBILE_FOOTER_BUTTONS?.map((item) => (
            <Button
              aria-label={item?.key}
              key={item?.key}
              onClick={item?.onClick}
              type='text'
              className='p-2 rounded-xl hover:bg-black/5 transition'
              icon={item?.icon}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MobileFooter
