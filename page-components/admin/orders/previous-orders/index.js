import React, { useEffect, useState } from 'react'
import {
  Button,
  Select,
  DatePicker,
  Card,
  Typography,
  Divider,
  Space,
} from 'antd'
import dayjs from 'dayjs'
import useGetAllStores from '../../hooks/useGetAllStores'
import useGetPreviousOrders from '../../hooks/useGetPreviousOrders'
import MyOrders from '@/page-components/my-orders'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

function PreviousOrders() {
  const today = new Date()
  const threeMonthsAgo = new Date(
    today.getFullYear(),
    today.getMonth() - 3,
    today.getDate(),
  )

  const { getAllStores, allStoresData } = useGetAllStores()
  const { getPreviousOrders, orderData, orderLoading } = useGetPreviousOrders()

  const [dates, setDates] = useState({ start: threeMonthsAgo, end: today })
  const [selectedStore, setSelectedStore] = useState()
  const [selectedUser, setSelectedUser] = useState()

  useEffect(() => {
    getAllStores()
  }, [])

  const STORE_OPTIONS = allStoresData?.map((item) => ({
    label: item?.name,
    value: item?.id,
  }))

  const USER_OPTIONS =
    Object.entries(selectedStore?.users || {})?.map(([key, value]) => ({
      label: value,
      value: key,
    })) || []

  if (USER_OPTIONS.length) {
    USER_OPTIONS.push({ label: 'ALL', value: 'ALL' })
  }

  const handleStoreChange = (e) => {
    const temp = allStoresData.find((item) => item?.id === e)
    setSelectedStore(temp)
    setSelectedUser()
  }

  const handleRangeChange = (dateRange) => {
    if (dateRange && dateRange[0] && dateRange[1]) {
      const start = dateRange[0].format('YYYY-MM-DD')
      const end = dateRange[1].format('YYYY-MM-DD')
      setDates({ start, end })
      getPreviousOrders({
        selectedStore,
        selectedUser,
        start,
        end,
      })
    }
  }

  const handleUserChange = (e) => {
    setSelectedUser(e)
  }

  const handleSubmit = () => {
    getPreviousOrders({
      selectedStore,
      selectedUser,
      start: dates?.start
        ? dayjs(dates.start).format('YYYY-MM-DD')
        : dayjs(threeMonthsAgo).format('YYYY-MM-DD'),
      end: dates?.end
        ? dayjs(dates.end).format('YYYY-MM-DD')
        : dayjs(today).format('YYYY-MM-DD'),
    })
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <Title level={3} className='!m-0'>
            Previous Orders
          </Title>
          <Text type='secondary'>
            Filter and view order history by store, user, and date range
          </Text>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <Text type='secondary'>Select Store</Text>
          <Select
            placeholder='Select Store'
            options={STORE_OPTIONS}
            value={selectedStore?.id}
            onChange={handleStoreChange}
            style={{ width: '100%' }}
          />
        </div>
        {selectedStore && (
          <div>
            <Text type='secondary'>Select User</Text>
            <Select
              placeholder='Select User'
              options={USER_OPTIONS}
              value={selectedUser}
              onChange={handleUserChange}
              style={{ width: '100%' }}
            />
          </div>
        )}
        {selectedUser && (
          <div>
            <Text type='secondary'>Date Range</Text>
            <RangePicker
              onChange={handleRangeChange}
              defaultValue={[dayjs(threeMonthsAgo), dayjs(today)]}
              style={{ width: '100%' }}
            />
          </div>
        )}
      </div>
      <div className='flex justify-end mt-2'>
        <Space>
          <Button
            type='primary'
            disabled={!(selectedStore && selectedUser)}
            onClick={handleSubmit}
            loading={orderLoading}>
            Show Previous Orders
          </Button>
        </Space>
      </div>
      <MyOrders
        orderData={orderData}
        isAdmin
        adminLoading={orderLoading}
        adminView
      />
    </div>
  )
}

export default PreviousOrders
