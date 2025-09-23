// components/BannerCarousel.jsx
import { Button, Carousel, Skeleton } from 'antd'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'

export default function BannerCarousel({ banners = [], loading = false }) {
  const { push } = useRouter()

  const handleClick = (url) => {
    if (url) push(url)
  }

  return (
    <div className='w-[47%] rounded-2xl overflow-hidden'>
      {loading ? (
        <Skeleton
          active
          paragraph={{ rows: 4 }}
          className='h-[400px] md:h-[500px]'
        />
      ) : (
        <Carousel autoplay dots className='w-full'>
          {banners.map((banner, index) => (
            <div key={index} className='relative w-full h-[400px] md:h-[500px]'>
              <div className='block w-full h-full'>
                <Image
                  src={banner.imageUrl}
                  alt='Banner Background'
                  layout='fill'
                  objectFit='cover'
                  className={`z-0 ${banner?.linkUrl ? 'cursor-pointer' : ''}`}
                  onClick={() => banner?.linkUrl && handleClick(banner.linkUrl)}
                />
              </div>
              <div className='relative z-20 w-full h-full flex flex-col md:flex-row items-center justify-center md:justify-between px-6 md:px-12'>
                <div className='text-white flex-1 text-center md:text-left'>
                  <p className='text-[clamp(14px,2vw,18px)] font-light'>
                    {banner.subtitle}
                  </p>
                  <h1 className='text-[clamp(28px,6vw,64px)] font-bold my-4'>
                    {banner.title}
                  </h1>
                  <p className='text-[clamp(14px,2vw,18px)] mb-6'>
                    {banner.description}
                  </p>
                  {banner?.linkUrl && (
                    <Button onClick={() => handleClick(banner.linkUrl)}>
                      Shop Now
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      )}
    </div>
  )
}
