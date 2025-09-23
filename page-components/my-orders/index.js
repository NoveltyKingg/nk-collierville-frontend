import React, { useEffect, useMemo, useState } from 'react'
import { Button, Dropdown, Segmented, Image } from 'antd'
import { CalendarOutlined, RightOutlined } from '@ant-design/icons'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import localeData from 'dayjs/plugin/localeData'
import { useRouter } from 'next/router'
import useGetContext from '@/common/context/useGetContext'
import useGetPreviousPurchases from './hooks/useGetPreviousPurchases'
import useRepeatPreviousOrder from './hooks/useRepeatPreviousOrder'
import { upperCase } from 'lodash'

dayjs.extend(weekday)
dayjs.extend(localeData)
const { RangePicker } = DatePicker

const STATUS_COLORS = {
  RECEIVED: 'bg-blue-100 text-blue-700',
  IN_PROCESS: 'bg-amber-100 text-amber-700',
  SHIPPED: 'bg-green-100 text-green-700',
  HOLD: 'bg-fuchsia-100 text-fuchsia-700',
  CANCELLED: 'bg-rose-100 text-rose-700',
  DELIVERED: 'bg-green-100 text-green-700',
}

function StatusPill({ label = 'In progress' }) {
  const normalized = label?.toUpperCase()?.replace(' ', '_') ?? 'IN_PROCESS'
  const color = STATUS_COLORS[normalized] || STATUS_COLORS.IN_PROCESS
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${color}`}>
      <span className='size-2 rounded-full bg-current/70' />
      {label}
    </span>
  )
}

export default function MyOrders({ orderData, isAdmin, adminLoading }) {
  const today = new Date()
  const threeMonthsAgo = new Date(
    today.getFullYear(),
    today.getMonth() - 3,
    today.getDate(),
  )

  const [dates, setDates] = useState({ start: threeMonthsAgo, end: today })
  const [status, setStatus] = useState('ALL')

  const { noveltyData } = useGetContext()
  const { profile } = noveltyData || {}

  const { getPreviousPurchases, data, loading } = useGetPreviousPurchases({
    storeId: profile?.storeId,
  })
  const { repeatPreviousOrder } = useRepeatPreviousOrder({
    storeId: profile?.storeId,
  })
  const { push } = useRouter()

  const list = useMemo(
    () => (isAdmin ? orderData : data) || [],
    [isAdmin, orderData, data],
  )

  const filtered = useMemo(() => {
    if (status === 'ALL') return list
    const map = {
      'IN PROGRESS': ['IN_PROCESS', 'RECEIVED'],
      DELIVERED: ['DELIVERED', 'SHIPPED'],
      CANCELLED: ['CANCELLED'],
    }
    return list.filter((ord) => map[status].includes(ord?.status))
  }, [list, status])

  const handleRangeChange = (dateRange) => {
    if (dateRange?.[0] && dateRange?.[1]) {
      const start = dateRange[0].format('YYYY-MM-DD')
      const end = dateRange[1].format('YYYY-MM-DD')
      setDates({ start, end })
      if (!isAdmin) getPreviousPurchases({ start, end })
    }
  }

  const DateDropdown = () => <div className='p-3'></div>

  const items = [
    {
      label: <DateDropdown />,
      key: 0,
    },
  ]

  const openOrder = (o) => {
    if (isAdmin) {
      window.open(`/${profile?.storeId}/my-orders/${o?.orderId}`, '_blank')
    } else {
      push(`/${profile?.storeId}/my-orders/${o?.orderId}`)
    }
  }

  useEffect(() => {
    if (!isAdmin) {
      getPreviousPurchases({
        start: threeMonthsAgo.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0],
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='mx-auto px-3 py-4'>
      <div className='mb-4 flex items-center gap-2 text-sm text-neutral-500'>
        <span
          className='cursor-pointer hover:text-neutral-800'
          onClick={() => push('/')}>
          Home
        </span>
        <span>›</span>
        <span
          className='cursor-pointer hover:text-neutral-800'
          onClick={() => push(`/${profile?.storeId}/profile`)}>
          My Account
        </span>
        <span>›</span>
        <span className='text-neutral-800 font-medium'>My Orders</span>
      </div>

      <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
        <Segmented
          size='large'
          value={status}
          onChange={(v) => setStatus(v)}
          options={['ALL', 'IN PROGRESS', 'DELIVERED', 'CANCELLED']}
          className='rounded-full'
        />
        <RangePicker
          onChange={handleRangeChange}
          defaultValue={[dayjs(threeMonthsAgo), dayjs(today)]}
          value={[dayjs(dates?.start), dayjs(dates?.end)]}
        />
      </div>

      <div className='space-y-4'>
        {filtered.map((o) => (
          <div
            key={o?.orderId}
            className='rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <StatusPill label={o?.status} />
              <div className='text-sm text-neutral-500'>
                {dayjs(o?.time || o?.createdAt).format('DD MMM YYYY')}
              </div>
            </div>

            <div className='mt-4 grid grid-cols-[auto_1fr_auto] items-center gap-4'>
              <div className='relative'>
                <Image
                  src={o?.items?.[0]?.productDetail?.imageUrls?.[0]}
                  className='size-16 rounded-xl object-cover'
                  alt='Loading...'
                />
                {o?.items?.length > 1 && (
                  <div className='absolute -right-2 -top-2 rounded-full bg-neutral-900 px-2 py-0.5 text-xs font-semibold text-white'>
                    +{o?.items?.length - 1}
                  </div>
                )}
              </div>

              <div className='min-w-0'>
                <div
                  onClick={() => openOrder(o)}
                  className='cursor-pointer text-[15px] font-semibold text-neutral-800 hover:underline'>
                  Order ID: {o?.orderId}
                </div>
                <div className='truncate text-neutral-600'>
                  {o?.items?.[0]?.productDetail?.name}
                  {o?.items?.length > 1 && (
                    <span className='text-neutral-500'>
                      {' '}
                      &amp; {o?.items?.length - 1} more items
                    </span>
                  )}
                </div>
                {o?.tracking && (
                  <div className='mt-1 text-xs text-neutral-500'>
                    Tracking: {o?.tracking}
                  </div>
                )}
              </div>

              <div className='flex items-center gap-3'>
                <div className='text-right'>
                  <div className='text-[15px] font-semibold'>
                    $ {o?.totalAmount ?? o?.priceWithTax ?? o?.priceWithoutTax}
                  </div>
                </div>
                <Button
                  onClick={() => openOrder(o)}
                  className='grid size-9 place-items-center rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200'>
                  <RightOutlined />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {(loading || adminLoading) && (
          <div className='rounded-xl border border-neutral-200 p-6 text-center text-neutral-500'>
            Loading orders…
          </div>
        )}

        {!loading && !adminLoading && (filtered || [])?.length === 0 && (
          <div className='rounded-xl border border-neutral-200 p-10 text-center text-neutral-500'>
            No orders found for this filter.
          </div>
        )}
      </div>
    </div>
  )
}
