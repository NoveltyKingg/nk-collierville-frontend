import React, { useMemo, useRef, useState } from 'react'
import { Image, Button } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'

export default function ProductGallery({ images = [] }) {
  const safe = useMemo(() => images.filter(Boolean), [images])
  const [active, setActive] = useState(safe[0] || null)
  const stripRef = useRef(null)

  if (!safe.length) return null

  const scroll = (dir) => {
    const el = stripRef.current
    if (!el) return
    const amount = el.clientWidth * 0.7
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <div className='space-y-4'>
      <div className='relative rounded-2xl bg-white border border-neutral-200 overflow-hidden group'>
        <Image.PreviewGroup items={safe}>
          <Image
            src={active}
            alt='Product'
            preview
            width='100%'
            height={520}
            style={{ objectFit: 'contain', background: '#fff' }}
            className='block transition-transform duration-300 group-hover:scale-[1.01]'
            placeholder
          />
        </Image.PreviewGroup>

        <div className='pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-neutral-50/80 to-transparent' />
        <div className='pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-neutral-50/80 to-transparent' />
      </div>

      <div className='relative'>
        <div className='flex items-center gap-2'>
          <Button
            shape='circle'
            type='text'
            className='hidden md:flex'
            onClick={() => scroll('left')}
            icon={<LeftOutlined />}
          />
          <div
            ref={stripRef}
            className='no-scrollbar flex gap-3 overflow-x-auto pb-1 w-full scroll-smooth'
            style={{ WebkitOverflowScrolling: 'touch' }}>
            {safe.map((src) => {
              const isActive = src === active
              return (
                <button
                  key={src}
                  type='button'
                  onClick={() => setActive(src)}
                  className={[
                    'relative shrink-0 overflow-hidden bg-white border',
                    isActive
                      ? 'border-[#385f43] ring-2 ring-[#385f43]/20'
                      : 'border-neutral-200',
                    'hover:shadow transition-all focus:outline-none',
                  ].join(' ')}
                  style={{ width: 110, height: 110 }}>
                  <Image
                    src={src}
                    preview={false}
                    alt='Thumb'
                    className='w-full h-full object-cover'
                  />
                </button>
              )
            })}
          </div>
          <Button
            shape='circle'
            type='text'
            className='hidden md:flex'
            onClick={() => scroll('right')}
            icon={<RightOutlined />}
          />
        </div>
      </div>
    </div>
  )
}
