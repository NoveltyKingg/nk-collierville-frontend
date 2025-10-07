import { Space, Button } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const getColumns = ({ handleDelete = () => {}, handleEdit = () => {} }) => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a href='#me'>{text}</a>,
  },
  {
    title: 'Image',
    dataIndex: 'imageUrls',
    key: 'imageUrls',
    render: (_, { imageUrls }) => (
      <Link href={imageUrls} target='_blank'>
        <Image src={imageUrls} alt='Loading...' width={40} height={40} />
      </Link>
    ),
  },
  {
    title: 'Stock',
    dataIndex: 'stock',
    key: 'stock',
  },
  {
    title: 'Bar codes',
    dataIndex: 'barcodes',
    key: 'barcodes',
    render: (_, { barcodes }) => barcodes.map((item) => `${item},`),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size='middle'>
        <Button onClick={() => handleEdit(record)}>Edit {record.name}</Button>
        <Button onClick={() => handleDelete(record)}>Delete</Button>
      </Space>
    ),
  },
]

export default getColumns
