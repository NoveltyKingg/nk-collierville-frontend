import React from 'react'
import { Divider } from 'antd'
import useGetContext from '@/common/context/useGetContext'
import useIsMobile from '@/utils/useIsMobile'
import { useRouter } from 'next/router'

export default function Footer() {
  const context = useGetContext()
  const categories = context?.noveltyData?.general?.categories || []
  const { isMobile } = useIsMobile()
  const { push } = useRouter()

  return (
    <footer className='bg-[#38455e] text-white bottom-0'>
      <div className='mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 py-4'>
        <div className='bg-[#f5f5f5] text-[#1a1a1a] rounded-2xl shadow-lg p-4 md:p-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-1'>
              <p className='text-[15px] font-semibold'>
                325 South Byhalia Road
              </p>
              <p className='text-[14px] opacity-80'>Collierville, TN 38017</p>
              <p className='text-[14px] opacity-80'>nkcollierville@gmail.com</p>
              <p className='text-[14px] opacity-80'>Tel: 123-456-7890</p>
            </div>

            <div className='space-y-1'>
              <p className='text-[#285a32] font-semibold'>Operating Hours</p>
              <p className='text-[14px] opacity-80'>
                Monday – Thursday: 8am – 8pm
              </p>
              <p className='text-[14px] opacity-80'>
                Friday – Saturday: 8am – 6pm
              </p>
              <p className='text-[14px] opacity-80'>Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>
      <div className='bg-[#38455e]'>
        <div className='mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 py-2'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-10'>
            <div className='space-y-3'>
              <p className='text-[13px] uppercase tracking-wider text-white/70'>
                Info
              </p>
              <div className='flex flex-col gap-2 text-[14px]'>
                <button
                  className='text-left hover:underline cursor-pointer'
                  onClick={() => push('/privacy')}>
                  Store Policy
                </button>
                <button
                  className='text-left hover:underline cursor-pointer'
                  onClick={() => push('/about')}>
                  About Us
                </button>
                <button
                  className='text-left hover:underline'
                  onClick={() => push('/contact')}>
                  Contact Us
                </button>
                <button className='text-left hover:underline'>FAQ</button>
              </div>
            </div>
            {/* <div className='md:col-span-3'>
              <p className='text-[13px] uppercase tracking-wider text-white/70 mb-3'>
                Categories
              </p>
              {/* <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-2 text-[14px]'>
                {categories.map((c) => (
                  <button
                    key={c?.value}
                    onClick={() => push(`/products?category=${c?.value}`)}
                    className='text-left hover:underline cursor-pointer'>
                    {c?.label}
                  </button>
                ))}
              </div>
            </div> */}
          </div>
        </div>
        <div className='h-px bg-white/10' />
        <div className='mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 py-2'>
          <div className='flex flex-col items-center gap-4'>
            <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] '>
              <a href='#' className='hover:underline !text-white'>
                Facebook
              </a>
              <Divider
                type={isMobile ? 'horizontal' : 'vertical'}
                className='!border-white/25 !m-0'
              />
              <a href='#' className='hover:underline !text-white'>
                Twitter
              </a>
              <Divider
                type={isMobile ? 'horizontal' : 'vertical'}
                className='!border-white/25 !m-0'
              />
              <a href='#' className='hover:underline !text-white'>
                Instagram
              </a>
              <Divider
                type={isMobile ? 'horizontal' : 'vertical'}
                className='!border-white/25 !m-0'
              />
              <a href='#' className='hover:underline !text-white'>
                YouTube
              </a>
            </div>
            <p className='text-xs text-white/60'>
              © 2025 Novelty King Collierville
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
