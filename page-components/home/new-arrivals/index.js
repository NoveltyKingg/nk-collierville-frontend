import { useEffect, useRef } from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Skeleton, Button } from 'antd'
import useGetNewArrivals from '../hooks/useGetNewArrivals'

const NewArrivals = ({ loading }) => {
  const scrollContainerRef = useRef()
  const { getNewArrivals, newArrivalsData } = useGetNewArrivals()

  useEffect(() => {
    getNewArrivals()
  }, [])

  const scroll = (direction) => {
    const { current } = scrollContainerRef
    const scrollAmount = current.offsetWidth / 2
    current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  const renderSkeletons = () =>
    Array.from({ length: 5 }).map((_, idx) => (
      <div
        key={idx}
        className='min-w-[200px] max-w-[260px] flex-shrink-0 border rounded-lg shadow-sm bg-white p-4 snap-center'>
        <Skeleton.Image style={{ width: '100%', height: 160 }} />
        <Skeleton active title={false} paragraph={{ rows: 2 }} />
      </div>
    ))

  const renderItems = () =>
    newArrivalsData?.map((item, idx) => (
      <div
        key={idx}
        className='min-w-[200px] max-w-[260px] flex-shrink-0 border border-[#f5f5f5] rounded-lg shadow-sm bg-white p-4 snap-center cursor-pointer'>
        <img
          src={item.imageUrls[0]}
          alt={item.name}
          className='w-full h-50 object-contain mb-2'
        />
        <div className='text-center'>
          <h3 className='font-semibold text-base'>{item?.name}</h3>
          <p className='text-[#385f43] font-bold mt-1'>${item?.sell}</p>
        </div>
      </div>
    ))

  return (
    <div className='relative w-full items-center'>
      <h2 className='text-2xl font-bold mb-4'>New Arrivals</h2>
      <div className='flex flex-row items-center justify-between relative'>
        <Button
          onClick={() => scroll('left')}
          type='text'
          shape='circle'
          className=' left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2'>
          <LeftOutlined />
        </Button>
        <div
          ref={scrollContainerRef}
          className='flex overflow-x-auto scroll-smooth scrollbar-hide space-x-4  py-4 snap-x snap-mandatory'>
          {loading ? renderSkeletons() : renderItems()}
        </div>
        <Button
          onClick={() => scroll('right')}
          type='text'
          shape='circle'
          className=' right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2'>
          <RightOutlined />
        </Button>
      </div>
    </div>
  )
}

export default NewArrivals
