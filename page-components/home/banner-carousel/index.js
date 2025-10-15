import React from 'react'
import { Carousel, Skeleton } from 'antd'
import Image from 'next/image'
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
        <Carousel autoplay dots>
          {banners.map((b, idx) => (
            <div key={idx} className='relative h-[38vh] md:h-[52vh]'>
              <Image
                src={b.imageUrl}
                alt={`Banner ${idx + 1}`}
                fill
                sizes='(max-width: 1024px) 100vw, 50vw'
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
