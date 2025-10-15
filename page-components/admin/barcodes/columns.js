import { Button, Image, Input, Space, Tooltip, message } from 'antd'
import React from 'react'
import {
  CheckOutlined,
  MinusCircleOutlined,
  BarcodeOutlined,
} from '@ant-design/icons'

const useGetColumns = ({
  handleScan,
  product,
  addBarcode,
  barcode,
  setBarcode,
  handleDelete,
  variationId,
  addBarcodeLoading,
  deleteBarcodeLoading,
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
    {
      title: 'Variation',
      dataIndex: 'name',
      key: 'name',
    },
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
          barcode, // potentially active input for this row
          ...(record?.barcodes?.map((val, idx) => ({
            id: idx + 1,
            variationId: record?.key,
            barcodeValue: val,
          })) || []),
        ].filter((val) => val?.variationId === record?.key)

        return (
          <div>
            {rows?.map(
              (item) =>
                item && (
                  <Space
                    key={`${record?.key}-${item?.id || 'new'}`}
                    style={{ marginBottom: 8 }}>
                    <Input
                      style={{ maxWidth: 300 }}
                      disabled={!item?.barcode}
                      onChange={(e) => handleChange(e, record)}
                      value={item?.barcodeValue || barcode?.barcode}
                      placeholder='Scan or type barcode'
                    />
                    {item?.barcodeValue ? (
                      <Tooltip title='Remove'>
                        <Button
                          icon={<MinusCircleOutlined />}
                          loading={deleteBarcodeLoading}
                          disabled={deleteBarcodeLoading}
                          onClick={() => handleDelete(item)}
                        />
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
              icon={<BarcodeOutlined />}
              onClick={(e) => handleScan(e, record, 'scan')}>
              Scan
            </Button>
          </div>
        )
      },
    },
  ]
}

export default useGetColumns
