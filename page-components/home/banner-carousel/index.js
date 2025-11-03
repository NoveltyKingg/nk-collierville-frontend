import React from 'react'
import { Carousel, Skeleton, Image } from 'antd'
import { useRouter } from 'next/router'

export default function BannerCarousel({ banners = [], loading = false }) {
  const { push } = useRouter()
  const handleClick = (url) => url && push(url)

  return (
    <div className='w-full lg:w-[calc(50%-12px)] rounded-2xl overflow-hidden bg-[#f7f7f7]'>
      {loading ? (
        <div className='relative h-[38vh] md:h-[52vh]'>
          <Skeleton.Image className='!w-full !h-full' />
        </div>
      ) : (
        <Carousel autoplay dots fade speed={1500}>
          {banners.map((b, idx) => (
            <div key={idx} className='relative '>
              <Image
                src={b.imageUrl}
                alt={`Banner ${idx + 1}`}
                width={'100%'}
                preview={false}
                className={`object-cover ${b.linkUrl ? 'cursor-pointer' : ''}`}
                onClick={() => handleClick(b.linkUrl)}
                priority={idx === 0}
              />
            </div>
          ))}
        </Carousel>
      )}
    </div>
  )
}
