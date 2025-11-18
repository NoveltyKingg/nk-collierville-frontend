import React, { useEffect, useState } from 'react'
import { Card, Skeleton, Image } from 'antd'
import { Carousel } from 'antd'
// import Image from 'next/image'
import { useRouter } from 'next/router'
import useGetPromotionalBanners from './hooks/useGetPromotionalBanners'
import useGetClearenceBanners from './hooks/useGetClearenceBanners'
import useGetHomeBanners from './hooks/useGetHomeBanners'
import useGetContext from '@/common/context/useGetContext'
import BannerCarousel from './banner-carousel'
import NewArrivals from './new-arrivals'
import { BestPriceIcon, ShippingIcon, TruckIcon } from '@/assets/home'
import DebounceSelect from '@/components/debounce-select'
import { SearchOutlined } from '@ant-design/icons'
import useQuerySearch from './hooks/useQuerySearch'
import useIsMobile from '@/utils/useIsMobile'

const PROMOTION_ITEMS = [
  { id: 1, text: 'Free shipping on orders over $500', icon: <ShippingIcon /> },
  { id: 2, text: 'Low prices guaranteed', icon: <BestPriceIcon /> },
  { id: 3, text: 'Express Delivery on bulk orders', icon: <TruckIcon /> },
]

export default function Home() {
  const { push } = useRouter()
  const [search, setSearch] = useState()

  const { isMobile } = useIsMobile()

  const { getPromotionalBanners, promotionalBanners, promotionalLoading } =
    useGetPromotionalBanners()
  const { getHomeBanners, homeBanners, homeLoading } = useGetHomeBanners()
  const { getClearenceBanners, clearenceBanners, clearenceLoading } =
    useGetClearenceBanners()

  const { queryTrigger } = useQuerySearch()

  const handleSelectProduct = (val) => {
    push(`/product/${val}`)
  }

  useEffect(() => {
    getHomeBanners()
    getPromotionalBanners()
    getClearenceBanners()
  }, [])

  return (
    <div className='w-full'>
      <div className='w-full flex flex-col gap-2 mt-2'>
        <div className='flex justify-end mr-4'>
          <DebounceSelect
            value={search}
            showSearch
            placeholder='Search product'
            fetchOptions={queryTrigger}
            handleSelect={handleSelectProduct}
            onChange={(newValue) => setSearch(newValue)}
            admin
            style={{
              width: isMobile ? '95%' : '50%',
            }}
            suffixIcon={<SearchOutlined />}
          />
        </div>
        <Carousel autoplay dots arrows fade speed={1500}>
          {homeLoading && (
            <div className='relative h-[38vh] md:h-[56vh]'>
              <Skeleton.Image className='!w-full !h-full' />
            </div>
          )}
          {!homeLoading &&
            Object.entries(homeBanners || {}).map(([src], i) => (
              <div key={i} className='relative h-full'>
                <Image
                  src={src}
                  alt={`Home banner ${i + 1}`}
                  width={'100%'}
                  priority={i === 0}
                  preview={false}
                />
              </div>
            ))}
        </Carousel>
      </div>

      {/* <section className='mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 -mt-4'>
        <Card className='rounded-2xl shadow-sm border-0'>
          <h2 className='text-xl md:text-2xl font-bold mb-3'>
            Shop by Category
          </h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6'>
            {categories?.map((cat) => (
              <button
                key={cat?.value}
                onClick={() => push(`/products?category=${cat?.value}`)}
                className='group flex flex-col items-center gap-3 rounded-xl p-3 bg-[#fafafa] hover:bg-white hover:shadow transition cursor-pointer'>
                <div className='relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-1 ring-zinc-200'>
                  <Image
                    src={cat?.imageUrl}
                    alt={cat?.label}
                    fill
                    sizes='120px'
                    className='object-cover'
                  />
                </div>
                <span className='text-sm font-semibold text-zinc-800 text-center'>
                  {cat?.label}
                </span>
              </button>
            ))}
          </div>
        </Card>
      </section> */}

      <section className='mx-auto px-4 sm:px-6 lg:px-8 py-4'>
        <div className='flex flex-col lg:flex-row gap-6'>
          <BannerCarousel
            banners={Object.entries(promotionalBanners || {}).map(
              ([imageUrl, linkUrl]) => ({ imageUrl, linkUrl }),
            )}
            loading={promotionalLoading}
          />
          <BannerCarousel
            banners={Object.entries(clearenceBanners || {}).map(
              ([imageUrl, linkUrl]) => ({ imageUrl, linkUrl }),
            )}
            loading={clearenceLoading}
          />
        </div>
      </section>

      <section className='mx-auto px-4 sm:px-6 lg:px-8'>
        <Card className='rounded-2xl shadow-sm border-0'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {PROMOTION_ITEMS.map((item) => (
              <div
                key={item.id}
                className='flex items-center gap-3 px-3 py-2 rounded-xl bg-[#fafafa] hover:bg-white hover:shadow transition'>
                <div className='text-[28px]'>{item.icon}</div>
                <div className='text-base md:text-lg font-semibold'>
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className='mx-auto px-4 sm:px-6 lg:px-8 py-4'>
        <Card className='rounded-2xl shadow-sm border-0'>
          <NewArrivals />
        </Card>
      </section>
    </div>
  )
}
