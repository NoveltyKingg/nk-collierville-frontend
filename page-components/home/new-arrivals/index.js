import React, { useEffect, useRef } from 'react'
import { Button, Skeleton } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import useGetNewArrivals from '../hooks/useGetNewArrivals'
import ProductCard from '@/components/product-card'

export default function NewArrivals() {
  const { getNewArrivals, newArrivalsData, loading } = useGetNewArrivals()
  const scroller = useRef()

  useEffect(() => {
    getNewArrivals()
  }, [])

  const scroll = (dir) => {
    const el = scroller.current
    if (!el) return
    const amount = el.clientWidth * 0.6
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  const SkeletonCard = () => (
    <div className='w-[220px] shrink-0 rounded-xl border border-zinc-100 bg-white p-3 snap-center'>
      <Skeleton.Image className='!w-full !h-[180px]' />
      <Skeleton active title={false} paragraph={{ rows: 2 }} className='mt-3' />
    </div>
  )

  return (
    <div className='relative'>
      <div className='flex items-center justify-between mb-3'>
        <h2 className='text-xl md:text-2xl font-bold'>New Arrivals</h2>
        <div className='hidden md:flex gap-2'>
          <Button
            onClick={() => scroll('left')}
            type='text'
            shape='circle'
            aria-label='Scroll left'>
            <LeftOutlined />
          </Button>
          <Button
            onClick={() => scroll('right')}
            type='text'
            shape='circle'
            aria-label='Scroll right'>
            <RightOutlined />
          </Button>
        </div>
      </div>

      <div
        ref={scroller}
        className='flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-1 pb-2'
        style={{ scrollbarWidth: 'none' }}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : (newArrivalsData || []).map((item, i) => (
              <ProductCard key={item?.id ?? i} item={item} />
            ))}
      </div>

      {/* Mobile controls */}
      <div className='md:hidden flex justify-center gap-3 mt-2'>
        <Button
          onClick={() => scroll('left')}
          size='small'
          icon={<LeftOutlined />}
        />
        <Button
          onClick={() => scroll('right')}
          size='small'
          icon={<RightOutlined />}
        />
      </div>
    </div>
  )
}
