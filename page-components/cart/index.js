import React, { useEffect, useMemo } from 'react'
import { Card, Input, Button, Empty, Divider } from 'antd'
import { ShoppingOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import useGetContext from '@/common/context/useGetContext'
import useGetCartItems from './hooks/useGetCartItems'
import ProductRow from './product-row'

const currency = (n = 0) =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  }).format(Number(n || 0))

const FREE_SHIPPING_MIN = 500

function Cart() {
  const { noveltyData } = useGetContext()
  const { profile } = noveltyData || {}

  const { getCartItems, cartData, loading } = useGetCartItems()
  const { push } = useRouter()

  useEffect(() => {
    if (profile?.storeId) getCartItems({ storeId: profile.storeId })
  }, [profile?.storeId])

  const { itemCount, totalQty, subtotal } = useMemo(() => {
    const items = cartData || []
    const qty = items.reduce((s, i) => s + Number(i?.quantity || 0), 0)
    const sub = items.reduce(
      (s, i) =>
        s + Number(i?.quantity || 0) * Number(i?.productDetails?.sell || 0),
      0,
    )
    return { itemCount: items.length, totalQty: qty, subtotal: sub }
  }, [cartData])

  const away = Math.max(0, FREE_SHIPPING_MIN - subtotal)

  return (
    <div className='w-full mx-auto p-6'>
      <div className='flex items-center gap-2 mb-4'>
        <ShoppingOutlined style={{ fontSize: 22 }} />
        <div className='text-2xl font-extrabold'>My Cart</div>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6'>
        <Card className='rounded-xl'>
          <div className='hidden md:grid grid-cols-[1fr_120px_130px_120px] py-2 text-[14px] uppercase tracking-wide text-gray-900'>
            <div>Item</div>
            <div className='text-center'>Each</div>
            <div className='text-center'>Quantity</div>
            <div className='text-right'>Total</div>
          </div>
          <Divider className='!my-3' />
          {!loading && (!cartData || cartData.length === 0) && (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className='my-10' />
          )}
          {(cartData || []).map((item, idx) => (
            <React.Fragment key={item?.productId}>
              <ProductRow product={item} getCartItems={getCartItems} />
              {idx !== (cartData?.length || 1) - 1 && (
                <Divider className='my-2' />
              )}
            </React.Fragment>
          ))}
          {!loading && cartData?.length > 0 && (
            <>
              <Divider className='!my-3' />
              <div className='flex items-center justify-between text-sm'>
                <div className='text-gray-600'>
                  <span className='font-semibold'>{itemCount}</span> Item
                  {itemCount !== 1 ? 's' : ''} ({totalQty} total units)
                </div>
                <div className='font-semibold'>{currency(subtotal)}</div>
              </div>
            </>
          )}
        </Card>
        <div className='h-fit'>
          <Card className='rounded-xl'>
            <div className='mb-4'>
              <div className='text-sm font-semibold mb-2'>Enter Promo Code</div>
              <div className='flex gap-2'>
                <Input placeholder='Promo Code' allowClear />
                <Button type='default'>Submit</Button>
              </div>
            </div>
            <Divider className='!my-3' />
            <div className='space-y-2 text-sm'>
              <div className='flex items-center justify-between'>
                <span className='text-gray-500'>Sub Total</span>
                <span>$ {subtotal}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-gray-500'>Shipping cost</span>
                <span>$ 0</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-gray-500'>Discount</span>
                <span>$ 0</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-gray-500'>Tax</span>
                <span>$ 0</span>
              </div>
            </div>
            <Divider className='my-3' />
            <div className='flex items-center justify-between text-base'>
              <span className='font-semibold'>Estimated Total</span>
              <span className='font-extrabold'>{currency(subtotal)}</span>
            </div>
            {away > 0 ? (
              <div className='mt-3 text-xs'>
                You’re{' '}
                <span className='text-red-500 font-semibold'>
                  {currency(away)}
                </span>{' '}
                away from free shipping!
              </div>
            ) : (
              <div className='mt-3 text-xs text-emerald-600'>
                You’ve unlocked free shipping!
              </div>
            )}
            <Button
              type='primary'
              size='large'
              className='w-full mt-5'
              disabled={!cartData || cartData.length === 0}
              onClick={() => push(`/${profile?.storeId}/checkout`)}>
              Checkout
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Cart
