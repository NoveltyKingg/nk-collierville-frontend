import { LoginIcon } from '@/assets/common'
import { BestPriceIcon, ShippingIcon, TruckIcon } from '@/assets/home'
import { Avatar } from 'antd'
import { Card } from 'antd'
import { Carousel, Image, Flex } from 'antd'
import React, { useEffect } from 'react'
import BannerCarousel from './banner-carousel'
import useGetPromotionalBanners from './hooks/useGetPromotionalBanners'
import useGetClearenceBanners from './hooks/useGetClearenceBanners'
import useGetHomeBanners from './hooks/useGetHomeBanners'
import useGetContext from '@/common/context/useGetContext'
import NewArrivals from './new-arrivals'
import { useRouter } from 'next/router'

const PROMOTION_ITEMS = [
  { id: 1, text: 'Free shipping on orders over $500', icon: <ShippingIcon /> },
  { id: 2, text: 'Low prices guaranteed', icon: <BestPriceIcon /> },
  { id: 3, text: 'Express Delivery on bulk orders', icon: <TruckIcon /> },
]

const ITEMS = [
  {
    name: 'Smartwatch Pro',
    price: '120.00',
    image:
      'https://noveltykingmedia.s3.us-east-2.amazonaws.com/Homepage/Banners/TAX TN MS.png',
  },
  {
    name: 'Galaxy Buds',
    price: '60.00',
    image:
      'https://noveltykingmedia.s3.us-east-2.amazonaws.com/Homepage/Banners/TAX TN MS.png',
  },
  {
    name: 'Ultra HD Drone',
    price: '350.00',
    image:
      'https://noveltykingmedia.s3.us-east-2.amazonaws.com/Homepage/Banners/TAX TN MS.png',
  },
  {
    name: 'Smartwatch Pro',
    price: '120.00',
    image:
      'https://noveltykingmedia.s3.us-east-2.amazonaws.com/Homepage/Banners/TAX TN MS.png',
  },
  {
    name: 'Galaxy Buds',
    price: '60.00',
    image:
      'https://noveltykingmedia.s3.us-east-2.amazonaws.com/Homepage/Banners/TAX TN MS.png',
  },
  {
    name: 'Ultra HD Drone',
    price: '350.00',
    image:
      'https://noveltykingmedia.s3.us-east-2.amazonaws.com/Homepage/Banners/TAX TN MS.png',
  },
  {
    name: 'Smartwatch Pro',
    price: '120.00',
    image:
      'https://noveltykingmedia.s3.us-east-2.amazonaws.com/Homepage/Banners/TAX TN MS.png',
  },
  {
    name: 'Galaxy Buds',
    price: '60.00',
    image:
      'https://noveltykingmedia.s3.us-east-2.amazonaws.com/Homepage/Banners/TAX TN MS.png',
  },
  {
    name: 'Ultra HD Drone',
    price: '350.00',
    image:
      'https://noveltykingmedia.s3.us-east-2.amazonaws.com/Homepage/Banners/TAX TN MS.png',
  },
  {
    name: 'Smartwatch Pro',
    price: '120.00',
    image:
      'https://noveltykingmedia.s3.us-east-2.amazonaws.com/Homepage/Banners/TAX TN MS.png',
  },
  {
    name: 'Galaxy Buds',
    price: '60.00',
    image:
      'https://noveltykingmedia.s3.us-east-2.amazonaws.com/Homepage/Banners/TAX TN MS.png',
  },
  {
    name: 'Ultra HD Drone',
    price: '350.00',
    image:
      'https://noveltykingmedia.s3.us-east-2.amazonaws.com/Homepage/Banners/TAX TN MS.png',
  },
]

const Home = () => {
  const { getPromotionalBanners, promotionalBanners, promotionalLoading } =
    useGetPromotionalBanners()
  const { getHomeBanners, homeBanners } = useGetHomeBanners()

  const { push } = useRouter()

  const context = useGetContext()
  const categories = context?.noveltyData?.general?.categories

  const { getClearenceBanners, clearenceBanners, clearenceLoading } =
    useGetClearenceBanners()

  useEffect(() => {
    getHomeBanners()
    getPromotionalBanners()
    getClearenceBanners()
  }, [])

  return (
    <Flex vertical gap={12} className='!mb-[10px]'>
      <Carousel autoplay>
        {Object.entries(homeBanners || {})?.map(([key, value], i) => (
          <div key={i} className='h-full w-full'>
            <Image src={key} preview={false} height={500} width={'100%'} />
          </div>
        ))}
      </Carousel>
      <Card className='!mx-[40px] flex flex-col'>
        <div className='text-[20px] font-bold'>Shop By Category</div>
        <Flex wrap='wrap' gap={20} align='center' justify='center'>
          {categories?.map((category) => (
            <Flex
              vertical
              align='center'
              className='cursor-pointer'
              onClick={() => push(`/products?category=${category?.value}`)}
              key={category?.value}>
              <Avatar
                shape='circle'
                size={{ sm: 60, md: 100, lg: 150, xl: 150, xxl: 180 }}
                src={category?.imageUrl}
              />
              <div className='text-[20px] font-bold'>{category?.label}</div>
            </Flex>
          ))}
        </Flex>
      </Card>
      <Flex justify='space-between' className='!px-[40px]'>
        <BannerCarousel
          banners={Object.entries(promotionalBanners || {})?.map(
            ([key, value]) => ({
              linkUrl: value,
              imageUrl: key,
            }),
          )}
          loading={promotionalLoading}
        />
        <BannerCarousel
          banners={Object.entries(clearenceBanners || {})?.map(
            ([key, value]) => ({
              linkUrl: value,
              imageUrl: key,
            }),
          )}
          loading={clearenceLoading}
        />
      </Flex>
      <Card className='!mx-[40px]'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          {PROMOTION_ITEMS.map((item, index) => (
            <div
              key={index}
              className='flex gap-[12px] items-center text-center text-[20px] font-bold'>
              {item?.icon || <LoginIcon />}
              {item?.text}
            </div>
          ))}
        </div>
      </Card>

      <Card className='!mx-[40px]'>
        <NewArrivals items={ITEMS} loading={false} />
      </Card>
    </Flex>
  )
}

export default Home
