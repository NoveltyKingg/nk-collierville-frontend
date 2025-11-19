import { Button, InputNumber, Image } from 'antd'
import React from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { Popconfirm } from 'antd'

const getColumns = ({
  handleAddToCart,
  addedQuantity,
  addFlavours,
  sortedInfo,
  getColumnSearchProps,
  varietiesChanged,
  deleteOption,
  deleteVariation,
  productData,
  updateLoading,
  deleteLoading,
  isEditOrder,
  isMobile,
  productQuantity,
}) => {
  const fixedColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a?.name?.localeCompare(b?.name),
      sortOrder: sortedInfo?.columnKey === 'name' ? sortedInfo.order : null,
      render: (text) => <a href='#me'>{text}</a>,
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (_, { imageUrl }) => (
        <div style={{ cursor: 'pointer' }}>
          <Image src={imageUrl} width={40} height={30} alt='Loading...' />
        </div>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_, record) => (
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '2px',
          }}>
          <InputNumber
            onChange={(e) => addFlavours(record, e)}
            type='number'
            defaultValue={
              Object.keys(addedQuantity || {})?.length > 0
                ? (addedQuantity || {})[record?.name]
                : productQuantity
            }
            min={0}
            onWheel={(e) => e.currentTarget.blur()}
          />{' '}
          <Button
            onClick={() =>
              handleAddToCart(
                record,
                (varietiesChanged || {})[record?.id],
                'flavour',
              )
            }
            loading={updateLoading}
            disabled={!(varietiesChanged || {})[record?.id]}>
            {isEditOrder && 'Add'}
            {deleteOption && !isEditOrder && 'Update'}
            {!deleteOption && !isEditOrder && 'Add to Cart'}
          </Button>
          {deleteOption && (
            <Popconfirm
              title='Delete item'
              description='Are you sure to delete this item?'
              okText='Yes'
              onConfirm={() => deleteVariation(productData?.id, record)}
              cancelText='No'>
              <Button icon={<DeleteOutlined />} loading={deleteLoading}>
                {isMobile ? '' : 'Delete'}
              </Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
    ,
  ]

  return fixedColumns
}
export default getColumns
