// components/orders/OrderModal.jsx
import React from 'react'
import { Modal, Card, Tag, Divider } from 'antd'
import { useRouter } from 'next/router'
import uniqid from 'uniqid'
import { formatDate } from '@/utils/format-date'

const COLORS = {
  RECEIVED: 'geekblue',
  IN_PROCESS: 'gold',
  SHIPPED: 'green',
  DELIVERED: 'green',
  HOLD: 'magenta',
  CANCELLED: 'red',
}

function StatusPill({ status }) {
  const map = {
    RECEIVED: 'Received',
    IN_PROCESS: 'In progress',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    HOLD: 'On hold',
    CANCELLED: 'Cancelled',
  }
  const color = COLORS[status] || 'default'
  return <Tag color={color}>{map[status] || status}</Tag>
}

export default function OrderModal({ open, setOpen }) {
  const { push } = useRouter()
  const visible = Boolean(open)

  const handleCancel = () => setOpen?.(undefined)

  const goToProduct = (prod) => {
    push(`/product/${prod?.productId ?? prod?.productDetail?.id}`)
    handleCancel()
  }

  const money = (n) =>
    typeof n === 'number' ? `₹ ${n.toLocaleString('en-IN')}` : n

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={960}
      title={
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='text-[15px] font-semibold text-neutral-800'>
            Order ID: {open?.orderId}
          </div>
          <div className='flex items-center gap-3 text-sm'>
            <span className='text-neutral-500'>Placed on</span>
            <span className='font-medium text-neutral-800'>
              {formatDate(open?.time || open?.createdAt)}
            </span>
            {open?.status && <StatusPill status={open?.status} />}
          </div>
        </div>
      }
      className='!rounded-2xl'
      styles={{ body: { maxHeight: 560, overflow: 'auto', paddingTop: 8 } }}>
      {/* top summary */}
      <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
        <Card className='rounded-2xl border-neutral-200'>
          <div className='text-sm text-neutral-500'>Delivery Address</div>
          <div className='mt-2 space-y-1 text-[15px] text-neutral-700'>
            <div className='font-medium'>{open?.addressName ?? 'Home'}</div>
            <div>
              {open?.address1}
              {open?.address2 && open?.address2 !== 'null'
                ? `, ${open?.address2}`
                : ''}
            </div>
            <div>
              {open?.city}, {open?.state}
            </div>
            <div>
              {open?.country} - {open?.zip}
            </div>
          </div>
        </Card>

        <Card className='rounded-2xl border-neutral-200'>
          <div className='text-sm text-neutral-500'>Order Summary</div>
          <div className='mt-2 space-y-1 text-[15px]'>
            <div className='flex items-center justify-between'>
              <span>Total qty</span>
              <span className='font-medium'>{open?.quantity}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span>Subtotal</span>
              <span className='font-medium'>
                {money(open?.priceWithoutTax)}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span>Total</span>
              <span className='font-semibold'>{money(open?.totalAmount)}</span>
            </div>
          </div>
        </Card>

        <Card className='rounded-2xl border-neutral-200'>
          <div className='text-sm text-neutral-500'>Meta</div>
          <div className='mt-2 space-y-1 text-[15px]'>
            <div className='flex items-center justify-between'>
              <span>Order date</span>
              <span className='font-medium'>
                {formatDate(open?.time || open?.createdAt)}
              </span>
            </div>
            {open?.tracking && (
              <div className='flex items-center justify-between'>
                <span>Tracking</span>
                <span className='font-medium'>{open?.tracking}</span>
              </div>
            )}
            {open?.invoiceUrl && (
              <a
                href={open?.invoiceUrl}
                target='_blank'
                rel='noreferrer'
                className='inline-block pt-1 text-sm font-medium text-blue-600 hover:underline'>
                Download invoice
              </a>
            )}
          </div>
        </Card>
      </div>

      {/* items */}
      <div className='rounded-2xl border border-neutral-200 bg-white p-4'>
        <div className='mb-3 text-base font-semibold text-neutral-800'>
          Items
        </div>
        <div className='space-y-3'>
          {open?.items?.map((item) => (
            <Card
              key={uniqid()}
              className='rounded-2xl border-neutral-200'
              bodyStyle={{ padding: 14 }}>
              <div className='grid grid-cols-[96px_1fr_auto] items-center gap-4'>
                <img
                  src={item?.productDetail?.imageUrls?.[0]}
                  alt='Loading...'
                  className='h-24 w-24 cursor-pointer rounded-xl object-cover'
                  onClick={() => goToProduct(item)}
                />

                <div className='min-w-0'>
                  <div
                    className='cursor-pointer truncate text-[15px] font-semibold text-neutral-800 hover:underline'
                    onClick={() => goToProduct(item)}>
                    {item?.productDetail?.name}
                  </div>
                  <div className='mt-1 text-sm text-neutral-500'>
                    {Object.keys(item?.varietiesCount || {}).length > 0 ? (
                      <span>
                        {Object.entries(item?.varietiesCount)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(' • ')}
                      </span>
                    ) : (
                      <>
                        Size: {item?.size || '—'}
                        <span className='mx-2'>|</span>
                        Qty: {item?.quantity}
                      </>
                    )}
                  </div>
                </div>

                <div className='text-right'>
                  <div className='text-[15px] font-semibold'>
                    {money(item?.price * item?.quantity)}
                  </div>
                  <button
                    className='mt-2 text-xs font-medium text-rose-600 hover:underline'
                    // hook up to your cancel flow if/when you add it
                    onClick={() => goToProduct(item)}>
                    Cancel
                  </button>
                </div>
              </div>
            </Card>
          ))}

          {!open?.items?.length && (
            <div className='rounded-xl border border-dashed border-neutral-300 p-8 text-center text-neutral-500'>
              No items found in this order.
            </div>
          )}
        </div>

        <Divider className='!my-4' />

        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='text-sm text-neutral-500'>
            Need help? Contact support with your Order ID.
          </div>
          <div className='text-right text-[15px]'>
            <span className='mr-3 font-medium text-neutral-600'>Total</span>
            <span className='font-semibold'>{money(open?.totalAmount)}</span>
          </div>
        </div>
      </div>
    </Modal>
  )
}
