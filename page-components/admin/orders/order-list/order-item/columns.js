import { Image, Typography } from 'antd'
import React from 'react'

const { Text } = Typography

export const COLUMNS = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  {
    title: 'Image',
    dataIndex: 'imageUrl',
    key: 'imageUrl',
    render: (_, { imageUrl }) =>
      imageUrl ? (
        <div style={{ cursor: 'pointer' }}>
          <Image src={imageUrl} width={40} height={30} alt='Product' />
        </div>
      ) : (
        <Text type='secondary'>—</Text>
      ),
  },
  { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render: (v) => (
      <span className='tabular-nums'>${Number(v || 0).toLocaleString()}</span>
    ),
  },
  { title: 'Varieties', dataIndex: 'varieties', key: 'varieties' },
]
