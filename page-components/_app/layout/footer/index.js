import useGetContext from '@/common/context/useGetContext'
import useIsMobile from '@/utils/useIsMobile'
import { Divider } from 'antd'
import { useRouter } from 'next/router'
import React from 'react'

export default function Footer() {
  const context = useGetContext()
  const categories = context?.noveltyData?.general?.categories
  const { isMobile } = useIsMobile()
  const { push } = useRouter()

  return (
    <footer className='w-full bg-[#385f43] text-white pt-10'>
      <div className='relative flex justify-center px-4'>
        <div className='bg-white text-black w-full max-w-6xl rounded-md shadow-md p-4 flex flex-col md:flex-row justify-between'>
          <div className='flex-1 space-y-2 '>
            <p className='font-semibold'>325 South Byhalia Road</p>
            <p>Collierville, TN 38017</p>
            <p>nkcollierville@gmail.com</p>
            <p>Tel: 123-456-7890</p>
          </div>
          <Divider type={isMobile ? 'horizontal' : 'vertical'} />
          <div className='flex-1 space-y-1'>
            <p className='text-green-900 font-semibold'>Operating Hours</p>
            <p>Monday – Thursday: 8am – 8pm</p>
            <p>Friday - Saturday: 8am – 6pm</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </div>
      <div className='bg-[#EAE0D5] pt-24 pb-8 mt-[-70px] px-6'>
        <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='space-y-2 text-sm text-[#341809]'>
            <p className='cursor-pointer'>Store Policy</p>
            <p className='cursor-pointer'>Returns</p>
            <p className='cursor-pointer'>FAQ</p>
          </div>
          <div className='md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm text-[#341809]'>
            {categories?.map((category, idx) => (
              <div
                key={idx}
                className='cursor-pointer w-full'
                onClick={() => push(`/products?category=${category?.value}`)}>
                {category?.label}
              </div>
            ))}
          </div>
        </div>

        <div className='mt-8 flex flex-col items-center gap-4 text-[#341809] font-bold text-lg'>
          <div className='flex flex-col gap-1 sm:flex-row'>
            <a href='#'>Facebook</a>
            <Divider
              type={isMobile ? 'horizontal' : 'vertical'}
              style={{ borderColor: '#341809', margin: '0px' }}
            />
            <a href='#'>Twitter</a>
            <Divider
              type={isMobile ? 'horizontal' : 'vertical'}
              style={{ borderColor: '#341809', margin: '0px' }}
            />
            <a href='#'>Instagram</a>
            <Divider
              type={isMobile ? 'horizontal' : 'vertical'}
              style={{ borderColor: '#341809', margin: '0px' }}
            />
            <a href='#'>Youtube</a>
          </div>
          <p className='text-xs text-gray-400 font-normal'>
            © 2025 Novelty King Wholesale
          </p>
        </div>
      </div>
    </footer>
  )
}
