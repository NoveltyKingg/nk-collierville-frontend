/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useMemo } from 'react'
import { Card, Collapse, Skeleton, Empty, Tag, Typography, Button } from 'antd'
import { ReloadOutlined, UserOutlined } from '@ant-design/icons'
import useGetCustomers from '../../hooks/useGetCustomers'
import PendingCustomerForm from './pending-customer-form'
import dayjs from 'dayjs'

const { Title, Text } = Typography

export default function PendingCustomers() {
  const {
    getCustomers,
    customersData = [],
    loading,
  } = useGetCustomers('PENDING_APPROVAL')

  useEffect(() => {
    getCustomers()
    const intervalId = setInterval(getCustomers, 30 * 60 * 1000)
    return () => clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const items = useMemo(() => {
    if (!customersData?.length) return []
    return customersData.map((item, idx) => {
      const title = item?.storeName || 'Unnamed Store'
      const email = item?.email || item?.storeEmail
      const city = [item?.city, item?.state].filter(Boolean).join(', ')
      const created = item?.createdAt || item?.appliedAt || item?.submittedAt
      const createdStr = created ? dayjs(created).format('MMM D, YYYY') : '—'
      const tier = item?.tier

      return {
        key: String(item?.storeId ?? idx),
        label: (
          <div className='flex items-center justify-between w-full gap-3'>
            <div className='flex items-center gap-2 min-w-0'>
              <UserOutlined className='text-slate-500' />
              <div className='min-w-0'>
                <div className='font-medium truncate'>{title}</div>
                <div className='text-xs text-slate-500 truncate'>
                  {email || 'No email'}
                  {city ? ` • ${city}` : ''}
                </div>
              </div>
            </div>
            <div className='flex items-center gap-2 shrink-0'>
              {tier ? <Tag color='blue'>Tier {tier}</Tag> : <Tag>Tier —</Tag>}
              <Tag color='default'>Submitted: {createdStr}</Tag>
            </div>
          </div>
        ),
        children: <PendingCustomerForm customer={item} />,
      }
    })
  }, [customersData])

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <Title level={3} className='!m-0'>
            Pending Customers
          </Title>
          <Text type='secondary'>
            {customersData?.length?.toLocaleString?.() || 0} awaiting review
          </Text>
        </div>
        <Button
          onClick={getCustomers}
          icon={<ReloadOutlined />}
          loading={loading}>
          Refresh
        </Button>
      </div>

      <Card className='rounded-2xl shadow-sm'>
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : !items.length ? (
          <Empty description='No pending customers' />
        ) : (
          <Collapse
            accordion
            items={items}
            className='bg-white [&_.ant-collapse-item]:rounded-xl [&_.ant-collapse-item]:overflow-hidden'
          />
        )}
      </Card>
    </div>
  )
}
