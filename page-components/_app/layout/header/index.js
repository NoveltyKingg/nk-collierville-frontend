import React, { useState } from 'react'
import DebounceSelect from '@/components/debounce-select'
import useQuerySearch from '../../hooks/useQuerySearch'
import { useRouter } from 'next/router'
import useIsMobile from '@/utils/useIsMobile'
import { Button } from 'antd'
import {
  AdminIcon,
  ChangeStoreIcon,
  ProfileIcon,
  LogoutIcon,
  CartIcon,
  AddNewStoreIcon,
} from '@/assets/header'
import useGetContext from '@/common/context/useGetContext'
import setCookie from '@/utils/set-cookie'
import { Dropdown } from 'antd'
import { getCookie } from '@/utils/get-cookie'
import useCreateLogin from '../../hooks/useCreateLogin'
import AddNewStore from '../add-new-store'

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [openAddNewStoreModal, setOpenAddNewStoreModal] = useState()

  const { queryTrigger } = useQuerySearch()
  const { noveltyData } = useGetContext()
  const { profile } = noveltyData || {}
  const { push } = useRouter()
  const { isMobile } = useIsMobile()

  const { createLogin } = useCreateLogin()

  const logout = () => {
    setCookie('nk-collierville-token', 'expired', -1)
  }

  const handleSelect = (e) => {
    push(`/product/${e}`)
  }

  const handleOpenAddNewStoreModal = () => {
    setOpenAddNewStoreModal((prev) => !prev)
  }

  const handleRoute = (path) => {
    if (!profile?.storeId) {
      push('/login')
    } else {
      push(path)
    }
  }

  const onStoreSelect = async ({ key }) => {
    const token = getCookie('nk-collierville-token')
    await createLogin({ storeId: key, token })
    location.reload()
  }

  const stores = Object.entries(profile?.stores || {})
    ?.map(([key, value]) => {
      if (profile?.storeId !== Number(key)) {
        return { label: value, key }
      }
    })
    .filter((val) => val !== undefined)

  console.log(stores, 'stores')

  return (
    <div className='w-full bg-main text-[#f3dbc3] min-h-16 flex items-center justify-between px-4 py-2'>
      <div onClick={() => push('/')} className='cursor-pointer'>
        Novelty King Icon
      </div>
      {!isMobile && (
        <div className='flex items-center gap-3'>
          <DebounceSelect
            searchValue={searchQuery}
            showSearch
            placeholder='Search'
            optionRoute='/products'
            fetchOptions={queryTrigger}
            handleSelect={handleSelect}
            onSearch={(val) => setSearchQuery(val)}
            style={{
              width: '500px',
              border: '0px',
              boxShadow: 'none',
            }}
          />
        </div>
      )}
      {!isMobile && (
        <div className='flex items-center gap-2 cursor-pointer text-white'>
          <Button
            type='text'
            icon={<AdminIcon />}
            className='!text-white'
            onClick={() => handleRoute('/admin')}>
            ADMIN
          </Button>
          <Button
            type='text'
            icon={<AddNewStoreIcon className='align-middle' />}
            onClick={handleOpenAddNewStoreModal}
            className='!text-white'>
            ADD NEW STORE
          </Button>
          <Button
            type='text'
            icon={<ProfileIcon />}
            className='!text-white'
            onClick={() =>
              handleRoute(`/${noveltyData?.profile?.storeId}/profile`)
            }>
            PROFILE
          </Button>
          <Button
            type='text'
            className='!text-white'
            icon={<CartIcon />}
            onClick={() =>
              handleRoute(`/${noveltyData?.profile?.storeId}/cart`)
            }>
            CART
          </Button>
          {stores?.length > 0 && (
            <Dropdown
              menu={{ items: stores, onClick: onStoreSelect }}
              trigger={['click']}>
              <Button
                type='text'
                icon={<ChangeStoreIcon />}
                className='!text-white'>
                CHANGE STORE
              </Button>
            </Dropdown>
          )}
          <Button
            type='text'
            icon={<LogoutIcon />}
            className='!text-white'
            onClick={logout}>
            LOGOUT
          </Button>
        </div>
      )}

      {openAddNewStoreModal && (
        <AddNewStore
          openAddStore={openAddNewStoreModal}
          handleClose={handleOpenAddNewStoreModal}
        />
      )}
    </div>
  )
}

export default Header
