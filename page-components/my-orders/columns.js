import { Button, Popover, Tag } from 'antd'
import React from 'react'
import {
  CompassOutlined,
  DownloadOutlined,
  MoreOutlined,
} from '@ant-design/icons'

const COLORS = {
  RECEIVED: 'geekblue',
  IN_PROCESS: '#f2a742',
  SHIPPED: '#87d068',
  HOLD: 'magenta',
  CANCELLED: '#b82431',
}

const getColumns = ({
  isAdmin,
  handleTracking,
  handleDonwloadInvoice,
  handleOrderDetails,
  repeatPreviousOrder,
}) => {
  const content = (record) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {record?.invoiceUrl && (
        <Button
          icon={<DownloadOutlined />}
          onClick={() => handleDonwloadInvoice(record?.invoiceUrl)}>
          Download Invoice
        </Button>
      )}
      {record?.tracking && (
        <Button
          icon={<CompassOutlined />}
          onClick={() => handleTracking(record?.tracking)}>
          Track Shipment
        </Button>
      )}
      {!isAdmin && (
        <Button onClick={() => repeatPreviousOrder(record?.orderId)}>
          Re-order
        </Button>
      )}
      <Button onClick={() => handleOrderDetails(record)}>
        View Order Details
      </Button>
    </div>
  )

  return [
    {
      title: 'Order Id',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => createdAt,
    },
    {
      title: 'Price',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (totalAmount) => <div>${totalAmount}</div>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={COLORS[status]}>{status}</Tag>,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <Popover content={() => content(record)} trigger='click'>
          <div style={{ cursor: 'pointer' }}>
            <MoreOutlined style={{ fontSize: 20 }} />
          </div>
        </Popover>
      ),
    },
  ]
}
export default getColumns
