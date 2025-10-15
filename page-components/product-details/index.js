/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Button,
  Card,
  Divider,
  InputNumber,
  Skeleton,
  Space,
  Tag,
  Typography,
  message,
} from 'antd'
import useGetContext from '@/common/context/useGetContext'
import useGetProduct from './hooks/useGetProduct'
import useAddToOrder from './hooks/useAddToOrder'
import useAddToCart from './hooks/useAddToCart'
import VarietiesTable from '@/components/varities-table'
import useIsMobile from '@/utils/useIsMobile'
import ProductGallery from './image-gallery'

const { Title, Text, Paragraph } = Typography

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(0)
  const [addedQuantity, setAddedQuantity] = useState({})
  const [flavoursData, setFlavoursData] = useState([])

  const { isMobile } = useIsMobile()
  const { query, push } = useRouter()
  const { noveltyData } = useGetContext()
  const { profile } = noveltyData || {}

  const { getProduct, productData, loading, error } = useGetProduct({
    setFlavoursData,
  })
  const { addToOrder, addToOrderLoading } = useAddToOrder()
  const { addToCart, addtoCartLoading } = useAddToCart()

  useEffect(() => {
    if (query?.productId) getProduct(query?.productId)
  }, [query?.productId])

  console.log(flavoursData, productData, 'VALUESSS')

  const images = useMemo(
    () => productData?.imageUrls || [],
    [productData?.imageUrls],
  )
  const orderLimit = productData?.orderQuantityLimit ?? null
  const hasVarieties = (productData?.varieties?.length || 0) > 0
  const inStock = productData?.inStock !== false
  const isEditingOrder = Boolean(query?.orderId && query?.admin)
  const CTAButtonLabel = isEditingOrder ? 'Add to Order' : 'Add to Cart'

  const showLoginPrice = !profile?.storeId
  const hasCustomization =
    Object.keys(productData?.customization || {}).length > 0

  const priceNode = showLoginPrice ? (
    <Button type='link' onClick={() => push('/login')}>
      Login to see prices
    </Button>
  ) : hasCustomization ? (
    <span>Price varies with customization</span>
  ) : (
    <>${Number(productData?.sell || 0).toFixed(2)}</>
  )

  const handleQuantity = (val) => {
    const next = Number(val) || 0
    if (orderLimit && next > orderLimit) {
      message.error(`You cannot add more than ${orderLimit}`)
      setQuantity(orderLimit)
      return
    }
    setQuantity(next)
  }

  const handleAddToCart = (record, qty) => {
    if (!profile?.isLoggedIn) {
      push('/login')
      return
    }
    if (Number.isNaN(qty)) return

    if (isEditingOrder) {
      addToOrder({
        quantity: qty,
        productId: record?.id,
        storeId: profile?.storeId,
      })
    } else {
      addToCart({
        quantity: qty,
        productId: record?.id,
        storeId: profile?.storeId,
      })
    }
  }

  return (
    <div className='w-full px-4 md:px-8 lg:px-10 py-6 md:py-8 flex flex-col gap-4'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8'>
        <Card className='rounded-3xl shadow-sm border-0 overflow-hidden'>
          {loading ? (
            <Skeleton active avatar paragraph={{ rows: 8 }} />
          ) : (
            <ProductGallery images={images} />
          )}
        </Card>
        <Card className='rounded-3xl shadow-sm border-0 overflow-hidden'>
          {loading ? (
            <Skeleton active paragraph={{ rows: 10 }} />
          ) : (
            <div className='space-y-5'>
              <div className='flex items-start justify-between gap-4'>
                <div className='space-y-1'>
                  <Title level={3} className='!m-0'>
                    {productData?.name}
                  </Title>
                  <Text type='secondary' className='text-sm'>
                    SKU: {productData?.id || '—'}
                  </Text>
                </div>
                <Space wrap>
                  {!inStock && <Tag color='#b82431'>Out of Stock</Tag>}
                  {productData?.preOrder && <Tag color='gold'>Pre-Order</Tag>}
                </Space>
              </div>

              {!!productData?.description && (
                <div className='relative'>
                  <Paragraph className='!mb-0 whitespace-pre-line leading-relaxed text-[15px]'>
                    {productData?.description}
                  </Paragraph>
                  <div className='absolute inset-x-0 -bottom-2 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent' />
                </div>
              )}

              <div className='rounded-2xl bg-neutral-50 border border-neutral-200 px-4 py-3 flex items-center justify-between'>
                <div className='text-[22px] font-bold text-[#385f43]'>
                  {priceNode}
                </div>
                {orderLimit && (
                  <Text strong className='text-[13px] tracking-wide'>
                    ORDER LIMIT:{' '}
                    <span className='font-black'>{orderLimit}</span>
                  </Text>
                )}
              </div>

              {productData?.preOrder && (
                <Text strong className='block'>
                  We’re only taking pre-orders on this product—thanks for your
                  patience!
                </Text>
              )}

              {!hasVarieties && (
                <div
                  className={`flex ${
                    isMobile ? 'flex-col' : 'items-center'
                  } gap-3`}>
                  <InputNumber
                    min={0}
                    value={quantity}
                    type='number'
                    onWheel={(e) => e.currentTarget.blur()}
                    onChange={handleQuantity}
                    className='transition-all'
                    style={{ width: isMobile ? '100%' : 160 }}
                  />
                  <Button
                    type='primary'
                    className='transition-transform hover:-translate-y-0.5'
                    style={{ width: isMobile ? '100%' : 220 }}
                    disabled={
                      !(quantity > 0) ||
                      (orderLimit ? quantity > orderLimit : false) ||
                      !inStock
                    }
                    loading={addtoCartLoading || addToOrderLoading}
                    onClick={() => handleAddToCart(productData, quantity)}>
                    {CTAButtonLabel}
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {!loading && hasVarieties && !error && (
        <Card className='rounded-3xl shadow-sm border-0 overflow-hidden'>
          <div className='space-y-1'>
            <Title level={4} className='!m-0'>
              Choose Flavours / Varieties
            </Title>
            <Text type='secondary'>Set quantities for each flavour below.</Text>
          </div>
          <Divider className='!my-3' />
          <VarietiesTable
            setAddedQuantity={setAddedQuantity}
            addedQuantity={addedQuantity}
            varietiesData={flavoursData}
            productData={productData}
            isEditOrder={isEditingOrder}
            isMobile={isMobile}
          />
        </Card>
      )}

      {/* Mobile sticky CTA when no varieties */}
      {!loading && !hasVarieties && inStock && (
        <div className='lg:hidden fixed left-0 right-0 bottom-0 z-[900]'>
          <div className='mx-4 mb-4 rounded-2xl bg-white/90 backdrop-blur border border-neutral-200 shadow-lg p-3 flex items-center gap-3'>
            <InputNumber
              min={0}
              value={quantity}
              type='number'
              onWheel={(e) => e.currentTarget.blur()}
              onChange={handleQuantity}
              className='flex-1'
              style={{ width: '100%' }}
            />
            <Button
              type='primary'
              size='large'
              className='flex-1'
              disabled={
                !(quantity > 0) || (orderLimit ? quantity > orderLimit : false)
              }
              loading={addtoCartLoading || addToOrderLoading}
              onClick={() => handleAddToCart(productData, quantity)}>
              {CTAButtonLabel}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
