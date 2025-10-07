import React, { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Collapse,
  Pagination,
  Segmented,
  Select,
  Card,
  Typography,
  Space,
  Tag,
  Empty,
  theme,
  Divider,
  Skeleton,
} from 'antd'
import {
  CaretRightOutlined,
  ReloadOutlined,
  EditOutlined,
  CarOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/router'
import useGetOrdersList from '../../hooks/useGetOrdersList'
import OrderItem from './order-item'
import useUpdateOrderStatus from '../../hooks/useUpdateOrderStatus'
import ShippingModal from './shipping-modal'

const { Title, Text } = Typography

const ORDER_OPTIONS = [
  { label: 'RECEIVED', value: 'RECEIVED', edit: true },
  { label: 'IN PROCESS', value: 'IN_PROCESS', edit: true },
  { label: 'SHIPPED', value: 'SHIPPED' },
  { label: 'DELIVERED', value: 'DELIVERED' },
  { label: 'HOLD', value: 'HOLD' },
  { label: 'CANCELLED', value: 'CANCELLED' },
]

function OrderList() {
  const [selectedOrderType, setSelectedOrderType] = useState('RECEIVED')
  const [statusChange, setStatusChange] = useState({})
  const [openShippingModal, setOpenShippingModal] = useState(false)
  const [orderId, setOrderId] = useState()
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 })

  const { getOrdersList, data, loading } = useGetOrdersList(selectedOrderType)
  const { updateOrderStatus } = useUpdateOrderStatus({
    orderId,
    status: statusChange[orderId],
    setStatusChange,
    setOrderId,
    getOrdersList,
  })

  const { push } = useRouter()

  useEffect(() => {
    getOrdersList({ page: pagination?.page, pageSize: pagination?.pageSize })
    const intervalId = setInterval(
      () =>
        getOrdersList({
          page: pagination?.page,
          pageSize: pagination?.pageSize,
        }),
      30 * 60 * 1000,
    )
    return () => clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, selectedOrderType])

  useEffect(() => {
    if (selectedOrderType)
      getOrdersList({
        page: pagination?.page,
        pageSize: pagination?.pageSize,
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrderType])

  useEffect(() => {
    if (orderId) updateOrderStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  const { token } = theme.useToken()
  const panelStyle = {
    marginBottom: 12,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  }

  const handleStatusChange = (item, value) => {
    setStatusChange((prev) => ({ ...prev, [item?.orderId]: value }))
  }

  const handleShippingModalChange = () => setOpenShippingModal(false)

  const handleUpdateStatus = (item, e) => {
    e?.stopPropagation?.()
    e?.preventDefault?.()
    if (statusChange[item?.orderId] === 'SHIPPED') {
      setOpenShippingModal(item)
    } else {
      setOrderId(item?.orderId)
    }
  }

  const handleEditOrder = (id) => push(`/admin/order/${id}`)

  const handleOrderTypeChange = (val) => {
    setSelectedOrderType(val)
    setPagination((p) => ({ ...p, page: 1 }))
  }

  const handlePagination = (page) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  const statusTagColor = (status) => {
    switch (status) {
      case 'RECEIVED':
        return 'default'
      case 'IN_PROCESS':
        return 'processing'
      case 'SHIPPED':
        return 'blue'
      case 'DELIVERED':
        return 'success'
      case 'HOLD':
        return 'orange'
      case 'CANCELLED':
        return 'error'
      default:
        return 'default'
    }
  }

  const Header = (
    <div className='flex items-center justify-between'>
      <div>
        <Title level={3} className='!m-0'>
          Orders
        </Title>
        <Text type='secondary'>
          Manage and track orders by status. Total:&nbsp;
          {(data?.totalElements ?? 0).toLocaleString()}
        </Text>
      </div>
      <Space>
        <Segmented
          options={ORDER_OPTIONS.map((o) => ({
            label: o.label,
            value: o.value,
          }))}
          size='large'
          value={selectedOrderType}
          onChange={handleOrderTypeChange}
          disabled={loading}
        />
      </Space>
    </div>
  )

  const items = useMemo(() => {
    if (!data?.orders?.length) return []
    return data.orders.map((item) => {
      const canEdit = ORDER_OPTIONS.find(
        (v) => v.value === selectedOrderType,
      )?.edit
      return {
        key: item?.orderId,
        label: (
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full'>
            <div className='min-w-0'>
              <div className='font-medium truncate'>
                Order ID: {item?.orderId} &nbsp;•&nbsp; Store: {item?.storeName}
              </div>
              <div className='text-xs text-slate-500 truncate'>
                Qty: {item?.quantity} &nbsp;•&nbsp; Total: $
                {Number(item?.totalAmount || 0).toLocaleString()}
              </div>
            </div>
            <Space size='small' wrap>
              <Tag color={statusTagColor(item?.status)}>{item?.status}</Tag>
              <Select
                options={ORDER_OPTIONS}
                style={{ width: 180 }}
                placeholder='Select Status'
                defaultValue={selectedOrderType}
                onChange={(val) => handleStatusChange(item, val)}
              />
              <Button
                type='primary'
                onClick={(e) => handleUpdateStatus(item, e)}
                disabled={!statusChange[item?.orderId]}>
                {statusChange[item?.orderId] === 'SHIPPED' ? (
                  <>
                    <CarOutlined /> Ship
                  </>
                ) : (
                  'Update Status'
                )}
              </Button>
              {canEdit && (
                <Button
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditOrder(item?.orderId)
                  }}>
                  Edit
                </Button>
              )}
            </Space>
          </div>
        ),
        children: <OrderItem item={item} loading={loading} />,
        style: panelStyle,
      }
    })
  }, [data?.orders, loading, panelStyle, selectedOrderType, statusChange])

  return (
    <div className='space-y-6 p-4'>
      {Header}
      <Card className='rounded-2xl shadow-sm'>
        <Divider className='!my-3' />
        {loading && !data?.orders?.length ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : !data?.orders?.length ? (
          <Empty description='No orders found for this status' />
        ) : (
          <>
            <Collapse
              bordered={false}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
              style={{ background: token.colorBgContainer }}
              items={items}
            />
            <div className='flex justify-end mt-3'>
              <Pagination
                total={data?.totalElements}
                current={pagination?.page}
                defaultPageSize={10}
                onChange={handlePagination}
              />
            </div>
          </>
        )}
      </Card>

      {openShippingModal && (
        <ShippingModal
          openShippingModal={openShippingModal}
          handleShippingModalChange={handleShippingModalChange}
          updateOrderStatus={updateOrderStatus}
        />
      )}
    </div>
  )
}

export default OrderList
