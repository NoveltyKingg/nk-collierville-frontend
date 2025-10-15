import React from 'react'
import { Table, Typography, Space } from 'antd'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { COLUMNS } from './columns'
import DownloadOrder from './download-order'

const { Text } = Typography

function OrderItem({ item, loading }) {
  const tableData = item?.items?.map((val) => ({
    key: val?.productDetail?.productId,
    name: val?.productDetail?.name,
    imageUrl: val?.productDetail?.imageUrls?.[0],
    quantity: val?.quantity,
    price: Number(val?.price || 0),
    varieties: JSON.stringify(val?.varietiesCount || val?.feature || {}),
  }))

  return (
    <div className='space-y-3'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
        <div>
          <div className='font-medium'>Order</div>
          <div className='text-slate-600'>#{item?.orderId}</div>
          <div className='text-xs'>
            <Text type='secondary'>Status:</Text> {item?.status}
          </div>
          <div className='text-xs'>
            <Text type='secondary'>Qty:</Text> {item?.quantity}
          </div>
        </div>
        <div className='md:col-span-2'>
          <div className='font-medium'>Store</div>
          <div>{item?.storeName}</div>
          <div className='text-xs text-slate-600'>
            {`${item?.address1} ${
              item?.address2 ? ', ' + item?.address2 : ''
            }, ${item?.city}, ${item?.state}, ${item?.country} ${item?.zip}`}
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
        <div>
          <Text type='secondary'>Price Without Tax:</Text>{' '}
          <span className='tabular-nums'>
            ${Number(item?.priceWithoutTax || 0).toLocaleString()}
          </span>
        </div>
        <div>
          <Text type='secondary'>Shipping Charges:</Text>{' '}
          <span className='tabular-nums'>
            ${Number(item?.shipping || 0).toLocaleString()}
          </span>
        </div>
        <div>
          <Text strong>Total Amount:</Text>{' '}
          <span className='tabular-nums'>
            ${Number(item?.totalAmount || 0).toLocaleString()}
          </span>
        </div>
      </div>

      <Table
        columns={COLUMNS}
        dataSource={tableData}
        pagination={false}
        size='small'
        scroll={{ y: 300 }}
      />

      {!loading && (
        <div className='flex justify-end'>
          <PDFDownloadLink
            document={<DownloadOrder item={item} />}
            fileName={`Order-${item?.orderId}.pdf`}>
            Download PDF
          </PDFDownloadLink>
        </div>
      )}
    </div>
  )
}

export default OrderItem
