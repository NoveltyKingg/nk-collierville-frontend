import useGetContext from '@/common/context/useGetContext'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import useGetProduct from './hooks/useGetProduct'
import useAddToOrder from './hooks/useAddToOrder'
import useAddToCart from './hooks/useAddToCart'
import { Tag, Button, Image, Skeleton } from 'antd'
import { InputNumber } from 'antd'
import VarietiesTable from '@/components/varities-table'
import uniqid from 'uniqid'
import useIsMobile from '@/utils/useIsMobile'

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(0)
  const [addedQuantity, setAddedQuantity] = useState({})
  const [flavoursData, setFlavoursData] = useState([])
  const [mainImage, setMainImage] = useState()

  const { query, push } = useRouter()

  const { noveltyData } = useGetContext()
  const { profile } = noveltyData || {}

  console.log(query, profile, 'queryyyy')

  const { getProduct, productData, loading, error } = useGetProduct({
    setFlavoursData,
    setMainImage,
  })
  const { addToOrder, addToOrderLoading } = useAddToOrder()
  const { isMobile } = useIsMobile()

  const { addToCart, data, addtoCartLoading } = useAddToCart()

  const handleQuantity = (e) => {
    setQuantity(e)
    if (e > productData?.orderQuantityLimit) {
      message.error('You cannot add more than Order Limit')
    }
  }

  const handleAddToCart = (record, e) => {
    if (!profile?.isLoggedIn) {
      push('/login')
    }
    if (profile?.isLoggedIn && !isNaN(e)) {
      setAddedQuantity({ ...addedQuantity, [record?.name]: e })
      if (query?.orderId && query?.admin) {
        addToOrder({
          quantity: e,
          productId: record?.id,
          storeId: profile?.storeId,
        })
      } else {
        addToCart({
          quantity: e,
          productId: record?.id,
          storeId: profile?.storeId,
        })
      }
    }
  }

  useEffect(() => {
    if (query?.productId) getProduct(query?.productId)
  }, [query?.productId])

  const handleClick = (item) => {
    setMainImage(item)
  }

  return (
    <div className='w-full flex flex-col items-start gap-4 pt-4'>
      <div className='w-full flex gap-4'>
        <div className='flex gap-4 pl-4'>
          {!isMobile && (
            <div className='flex flex-col gap-4'>
              {productData?.imageUrls?.map((item) => (
                <div
                  onClick={() => handleClick(item)}
                  key={uniqid()}
                  className='cursor-pointer'>
                  <Image
                    src={item}
                    width='100px'
                    height='100px'
                    alt='Loading...'
                    preview={false}
                  />
                </div>
              ))}
            </div>
          )}
          {loading ? (
            <Skeleton />
          ) : (
            <div>
              <Image
                src={mainImage}
                preview={false}
                alt={productData?.name || 'Loading...'}
              />
            </div>
          )}
        </div>
        <div className='w-full pr-4 flex flex-col gap-4'>
          <div className='text-[26px] font-bold'>{productData?.name}</div>
          <div className='text-[16px] font-semibold flex flex-col gap-2'>
            {productData?.description?.split('\n').map((item) => (
              <div key={uniqid()}>{item}</div>
            ))}
          </div>
          {productData?.orderQuantityLimit && (
            <div className='bold'>
              ORDER LIMIT: {productData?.orderQuantityLimit}
            </div>
          )}
          <div className='text-[22px] font-bold text-[#ff8540]'>
            ${' '}
            {profile?.storeId &&
              Object.keys(productData?.customization || {})?.length > 0 &&
              'Price will change according to Customization'}
            {profile?.storeId &&
              Object.keys(productData?.customization || {})?.length <= 0 &&
              productData?.sell}
            {!profile?.storeId && (
              <Button type='link' onClick={() => push('/login')}>
                Login to see prices
              </Button>
            )}
          </div>
          {!productData?.inStock && <Tag color='#b82431'>Out of Stock</Tag>}
          {productData?.preOrder && (
            <div style={{ fontSize: '14px', fontWeight: 700 }}>
              For this product, we are only taking the preorders, so please
              cooperate with us
            </div>
          )}
          {!productData?.varieties?.length > 0 && (
            <div className='flex gap-2 items-center'>
              <InputNumber
                min={0}
                defaultValue={0}
                type='number'
                onWheel={(e) => e.currentTarget.blur()}
                onChange={(e) => handleQuantity(e)}
              />
              <Button
                style={{ width: isMobile ? '100%' : '250px' }}
                disabled={
                  !quantity > 0 ||
                  quantity > productData?.orderQuantityLimit ||
                  !productData?.inStock
                }
                loading={addtoCartLoading || addToOrderLoading}
                onClick={() =>
                  handleAddToCart(productData, quantity, 'product')
                }>
                {query?.orderId && query?.admin
                  ? 'Add to Order'
                  : ' Add to Cart'}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className='w-full px-8 flex flex-col gap-4 pb-4'>
        {productData?.varieties?.length > 0 && !error && (
          <div>
            <div>
              Below are the list of different flavours of the same product , you
              can add the quantity accordingly:{' '}
            </div>
            <div>
              <VarietiesTable
                setAddedQuantity={setAddedQuantity}
                addedQuantity={addedQuantity}
                varietiesData={flavoursData}
                productData={productData}
                isEditOrder={query?.orderId && query?.admin}
                isMobile={isMobile}
              />{' '}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
