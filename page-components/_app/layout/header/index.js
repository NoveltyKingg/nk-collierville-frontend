import React, { useState } from 'react'
import { LoginIcon } from '@/assets/common'
import DebounceSelect from '@/components/debounce-select'
import useQuerySearch from '../../hooks/useQuerySearch'
import { useRouter } from 'next/router'
import useIsMobile from '@/utils/useIsMobile'

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const { queryTrigger } = useQuerySearch()
  const { push } = useRouter()
  const { isMobile } = useIsMobile()

  const handleSelect = (e) => {
    push(`/product/${e}`)
  }

  return (
    <div className='w-full bg-main text-[#f3dbc3] min-h-16 flex items-center justify-between px-4 py-2'>
      <div>Novelty King Icon</div>
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
      <div className='flex flex-row items-center gap-12'>
        {!isMobile && (
          <div className='flex flex-row items-center gap-4'>
            <div className='cursor-pointer border-r-1 border-[#f3dbc3] pr-4'>
              Shop All
            </div>
            <div className='cursor-pointer border-r-1 border-[#f3dbc3] pr-4'>
              About
            </div>
            <div className='cursor-pointer'>Contact</div>
          </div>
        )}
        <div className='flex items-center gap-4 cursor-pointer'>
          <div>
            <LoginIcon />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
