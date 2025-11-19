import { Button, Image, Input, Space, Tooltip, message, Popconfirm } from 'antd'
import {
  CheckOutlined,
  MinusCircleOutlined,
  ScanOutlined,
} from '@ant-design/icons'
import React from 'react'

const useGetColumns = ({
  product,
  addBarcode,
  barcode,
  setBarcode,
  handleDelete,
  addBarcodeLoading,
  deleteBarcodeLoading,
  onScanClick,
}) => {
  const handlePlus = ({ record }) => {
    if (barcode?.barcode && barcode?.variationId === record?.key) {
      addBarcode({ productId: product, variationId: record?.key })
    } else {
      message.error("You haven't added any barcode")
    }
  }

  const handleChange = (e, record) => {
    if (barcode?.variationId && barcode?.variationId === record?.key) {
      setBarcode((prev) => ({ ...prev, barcode: e.target.value }))
    }
  }

  return [
    { title: 'Variation', dataIndex: 'name', key: 'name' },
    {
      title: 'Image',
      dataIndex: 'imageUrls',
      key: 'imageUrls',
      render: (_, { imageUrls }) => (
        <Image src={imageUrls} alt='Loading...' width={40} height={40} />
      ),
    },
    {
      title: 'Barcodes',
      dataIndex: 'barcode',
      key: 'barcode',
      render: (_, record) => {
        const rows = [
          barcode,
          ...(record?.barcodes?.map((val, idx) => ({
            id: idx + 1,
            variationId: record?.key,
            barcodeValue: val,
          })) || []),
        ].filter((val) => val?.variationId === record?.key)

        return (
          <div className='flex gap-2 flex-wrap'>
            {rows?.map(
              (item) =>
                item && (
                  <Space
                    key={`${record?.key}-${item?.id || 'new'}`}
                    style={{ marginBottom: 8 }}>
                    <Input
                      style={{ maxWidth: 300 }}
                      disabled={!('barcode' in item)}
                      onChange={(e) => handleChange(e, record)}
                      value={item?.barcodeValue ?? barcode?.barcode ?? ''}
                      placeholder='Scan or type barcode'
                    />
                    {item?.barcodeValue ? (
                      <Tooltip title='Remove'>
                        <Popconfirm
                          title='Delete the task'
                          description='Are you sure to delete this barcode?'
                          onConfirm={() => handleDelete(item)}
                          okText='Yes'
                          cancelText='No'>
                          <Button
                            icon={<MinusCircleOutlined />}
                            loading={deleteBarcodeLoading}
                            disabled={deleteBarcodeLoading}
                          />
                        </Popconfirm>
                      </Tooltip>
                    ) : (
                      <Tooltip title='Add'>
                        <Button
                          type='primary'
                          icon={<CheckOutlined />}
                          loading={addBarcodeLoading}
                          disabled={addBarcodeLoading}
                          onClick={() => handlePlus({ record })}
                        />
                      </Tooltip>
                    )}
                  </Space>
                ),
            )}
            <Button
              icon={<ScanOutlined />}
              onClick={() => onScanClick(record.key)}>
              Scan Barcode
            </Button>
          </div>
        )
      },
    },
  ]
}

export default useGetColumns
