import React, { useEffect } from 'react'
import { Button, Card, Divider, Steps, Tag, Image } from 'antd'
import { DownloadOutlined, CompassOutlined } from '@ant-design/icons'
import uniqid from 'uniqid'
import useGetContext from '@/common/context/useGetContext'
import useGetOrderDetails from '../hooks/useGetOrderDetails'
import { useRouter } from 'next/router'

const STATUS_TO_STEP = {
  RECEIVED: 0,
  IN_PROCESS: 1,
  SHIPPED: 2,
  DELIVERED: 3,
}

function LineItem({ item, onClick }) {
  return (
    <Card className='mb-3 rounded-2xl border-neutral-200'>
      <div className='grid grid-cols-[96px_1fr_auto] items-center gap-4'>
        <Image
          src={item?.productDetail?.imageUrls?.[0]}
          className='h-24 w-24 rounded-xl object-cover'
          alt='Loading...'
          onClick={onClick}
        />
        <div className='min-w-0'>
          <div className='truncate text-[15px] font-semibold text-neutral-800'>
            {item?.productDetail?.name}
          </div>
          <div className='mt-1 text-sm text-neutral-500'>
            Size: {item?.size || item?.productDetail?.size || '—'}{' '}
            <span className='mx-2'>|</span> Qty: {item?.quantity}
          </div>
        </div>
        <div className='text-right'>
          <div className='text-[15px] font-semibold'>
            $ {item?.price * item?.quantity}
          </div>
          <div className='mt-1 text-xs'>
            <Tag color='gold'>In progress</Tag>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function OrderDetails() {
  const { noveltyData } = useGetContext()
  const { profile } = noveltyData || {}
  const { push, query } = useRouter()

  const { getOrderDetails, loading, data } = useGetOrderDetails({
    storeId: profile?.storeId,
    orderId: query?.orderId,
  })

  useEffect(() => {
    if (query?.orderId) getOrderDetails()
  }, [query?.orderId])

  const onInvoice = () =>
    data?.invoiceUrl && window.open(data?.invoiceUrl, '_blank')
  const onTrack = () =>
    data?.tracking &&
    window.open(
      `https://www.ups.com/track?track=yes&trackNums=${data?.tracking}&loc=en_US&requester=ST/trackdetails`,
      '_blank',
    )

  const stepIndex = STATUS_TO_STEP[data?.status] ?? 0

  return (
    <div className='mx-auto px-3 py-5'>
      <div className='mb-4 flex items-center gap-2 text-sm text-neutral-500'>
        <span
          className='cursor-pointer hover:text-neutral-800'
          onClick={() => push('/')}>
          Home
        </span>
        <span>›</span>
        <span
          className='cursor-pointer hover:text-neutral-800'
          onClick={() => push(`/${profile?.storeId}/my-orders`)}>
          My Orders
        </span>
        <span>›</span>
        <span className='text-neutral-800 font-medium'>
          Order ID: {data?.orderId}
        </span>
      </div>

      <div className='mb-5 grid grid-cols-1 gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:grid-cols-4'>
        <div className='flex flex-col'>
          <div className='text-sm text-neutral-500'>Order ID</div>
          <div className='font-semibold text-neutral-800'>{data?.orderId}</div>
        </div>
        <div className='flex flex-col'>
          <div className='text-sm text-neutral-500'>Total</div>
          <div className='font-semibold text-neutral-800'>
            $ {data?.totalAmount}
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='text-sm text-neutral-500'>You saved</div>
          <div className='font-semibold text-emerald-700'>
            $ {data?.savings ?? 0}
          </div>
        </div>
        <div className='flex items-center justify-between gap-3 md:justify-end'>
          <div className='text-sm text-neutral-500'>Date</div>
          <div className='font-semibold text-neutral-800'>
            {data?.createdAt}
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-[1fr_360px]'>
        <div>
          <div className='rounded-2xl border border-neutral-200 bg-white p-5'>
            <div className='mb-4 text-base font-semibold text-neutral-800'>
              Items Ordered & Delivery Details
            </div>
            <div className='mb-6'>
              <Steps
                current={stepIndex}
                items={[
                  {
                    title: 'Order confirmed',
                    description: data?.createdAt,
                  },
                  { title: 'Shipped', description: '—' },
                  { title: 'Delivery pending', description: '—' },
                ]}
              />
            </div>

            {loading ? (
              <div className='rounded-xl border border-neutral-200 p-6 text-center text-neutral-500'>
                Loading…
              </div>
            ) : (
              data?.items?.map((item) => (
                <LineItem
                  key={uniqid()}
                  item={item}
                  onClick={() => push(`/product/${item?.productDetail?.id}`)}
                />
              ))
            )}
          </div>
        </div>

        <div className='flex flex-col gap-6'>
          <Card
            className='rounded-2xl border-neutral-200'
            title='Delivery Address'>
            <div className='space-y-1 text-[15px] text-neutral-700'>
              <div className='font-medium'>{data?.addressName ?? 'Home'}</div>
              <div>
                {data?.address1}
                {data?.address2 && data?.address2 !== 'null'
                  ? `, ${data?.address2}`
                  : ''}
              </div>
              <div>
                {data?.city}, {data?.state}
              </div>
              <div>
                {data?.country} - {data?.zip}
              </div>
            </div>
          </Card>
          <Card
            className='rounded-2xl border-neutral-200'
            title='Payment details'>
            <div className='space-y-2 text-[15px]'>
              {data?.items?.map((item) => (
                <div
                  key={uniqid()}
                  className='flex items-center justify-between'>
                  <span className='truncate'>{item?.productDetail?.name}</span>
                  <span>$ {item?.price * item?.quantity}</span>
                </div>
              ))}
              <Divider />
              {data?.couponSavings && (
                <div className='flex items-center justify-between text-emerald-700'>
                  <span>Coupon savings</span>
                  <span>-$ {data?.couponSavings}</span>
                </div>
              )}
              {data?.deliveryFee && (
                <div className='flex items-center justify-between'>
                  <span>Delivery</span>
                  <span>$ {data?.deliveryFee}</span>
                </div>
              )}
              <div className='flex items-center justify-between text-base font-semibold'>
                <span>Total</span>
                <span>$ {data?.totalAmount}</span>
              </div>
            </div>
          </Card>

          <div className='flex gap-3'>
            <Button
              icon={<DownloadOutlined />}
              disabled={!data?.invoiceUrl}
              onClick={onInvoice}
              className='flex-1 rounded-xl'>
              Download Invoice
            </Button>
            <Button
              type='primary'
              icon={<CompassOutlined />}
              disabled={!data?.tracking}
              onClick={onTrack}
              className='flex-1 rounded-xl'>
              Track Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
