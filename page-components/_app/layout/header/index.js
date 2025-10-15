import React, { useState } from 'react'
import DebounceSelect from '@/components/debounce-select'
import useQuerySearch from '../../hooks/useQuerySearch'
import { useRouter } from 'next/router'
import useIsMobile from '@/utils/useIsMobile'
import { Button, Dropdown } from 'antd'
import {
  AdminIcon,
  ProfileIcon,
  LogoutIcon,
  CartIcon,
  AddNewStoreIcon,
  ChangeStoreIcon,
  LoginIcon,
} from '@/assets/header'
import useGetContext from '@/common/context/useGetContext'
import setCookie from '@/utils/set-cookie'
import { getCookie } from '@/utils/get-cookie'
import useCreateLogin from '../../hooks/useCreateLogin'
import AddNewStore from '../add-new-store'

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [openAddNewStoreModal, setOpenAddNewStoreModal] = useState(false)
  const { queryTrigger } = useQuerySearch()
  const { noveltyData } = useGetContext()
  const { profile } = noveltyData || {}
  const { push } = useRouter()
  const { isMobile } = useIsMobile()
  const { createLogin } = useCreateLogin()

  const logout = () => {
    setCookie('nk-collierville-token', 'expired', -1)
    push('/login')
  }

  const handleSelect = (id) => push(`/product/${id}`)
  const toggleAddStore = () => setOpenAddNewStoreModal((s) => !s)

  const routeGuard = (path) => (!profile?.storeId ? push('/login') : push(path))

  const onStoreSelect = async ({ key }) => {
    const token = getCookie('nk-collierville-token')
    await createLogin({ storeId: key, token })
    location.reload()
  }

  console.log(profile, 'profile')

  const stores =
    Object.entries(profile?.stores || {})
      ?.map(([key, value]) =>
        profile?.storeId !== Number(key) ? { label: value, key } : undefined,
      )
      .filter(Boolean) || []

  return (
    <header className='sticky top-0 z-[55] shadow-sm'>
      <div className='bg-main text-[#f3dbc3]'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='h-16 flex items-center gap-4'>
            <button
              onClick={() => push('/')}
              className='shrink-0 flex items-center gap-2 group'>
              <div className='w-9 h-9 rounded-full bg-white/15 grid place-items-center group-hover:bg-white/20 transition'>
                <span className='text-[12px] font-bold'>NK</span>
              </div>
              <span className='hidden sm:block font-semibold tracking-wide'>
                Novelty King
              </span>
            </button>

            {!isMobile && (
              <div className='flex-1'>
                <DebounceSelect
                  searchValue={searchQuery}
                  showSearch
                  placeholder='Search products…'
                  optionRoute='/products'
                  fetchOptions={queryTrigger}
                  handleSelect={handleSelect}
                  onSearch={(val) => setSearchQuery(val)}
                  style={{
                    width: '100%',
                    border: '0px',
                    boxShadow: 'none',
                  }}
                />
              </div>
            )}

            {!isMobile && (
              <div className='flex items-center gap-1 sm:gap-2'>
                {profile?.status === 'ADMIN' && profile?.isLoggedIn && (
                  <Button
                    type='text'
                    icon={<AdminIcon className='align-middle' />}
                    className='!text-white'
                    onClick={() => routeGuard('/admin')}>
                    <span className='hidden md:inline'>Admin</span>
                  </Button>
                )}
                {profile?.isLoggedIn && (
                  <Button
                    type='text'
                    icon={<AddNewStoreIcon className='align-middle' />}
                    onClick={toggleAddStore}
                    className='!text-white'>
                    <span className='hidden md:inline'>Add Store</span>
                  </Button>
                )}
                {profile?.isLoggedIn && (
                  <Button
                    type='text'
                    icon={<ProfileIcon className='align-middle' />}
                    className='!text-white'
                    onClick={() => routeGuard(`/${profile?.storeId}/profile`)}>
                    <span className='hidden md:inline'>Profile</span>
                  </Button>
                )}
                {profile?.isLoggedIn && (
                  <Button
                    type='text'
                    icon={<CartIcon className='align-middle' />}
                    className='!text-white'
                    onClick={() => routeGuard(`/${profile?.storeId}/cart`)}>
                    <span className='hidden md:inline'>Cart</span>
                  </Button>
                )}
                {stores?.length > 0 && (
                  <Dropdown
                    menu={{ items: stores, onClick: onStoreSelect }}
                    trigger={['click']}>
                    <Button
                      type='text'
                      icon={<ChangeStoreIcon className='align-middle' />}
                      className='!text-white'>
                      <span className='hidden md:inline'>Change Store</span>
                    </Button>
                  </Dropdown>
                )}
                {profile?.isLoggedIn && (
                  <Button
                    type='text'
                    icon={<LogoutIcon className='align-middle' />}
                    className='!text-white'
                    onClick={logout}>
                    <span className='hidden md:inline'>Logout</span>
                  </Button>
                )}
                {!profile?.isLoggedIn && (
                  <Button
                    onClick={() => push('/login')}
                    icon={<LoginIcon className='align-middle' />}>
                    LOGIN
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {openAddNewStoreModal && (
        <AddNewStore
          openAddStore={openAddNewStoreModal}
          handleClose={toggleAddStore}
        />
      )}
    </header>
  )
}

export default Header
