import { Button, Input, Space, Tooltip } from 'antd'
import React, { useEffect } from 'react'
import {
  MinusCircleOutlined,
  CheckOutlined,
  BarcodeOutlined,
} from '@ant-design/icons'
import useGetProduct from '../../hooks/useGetProduct'

function ProductBarcode({
  product,
  handleDelete,
  addBarcode,
  handleScan,
  addBarcodeLoading,
  deleteBarcodeLoading,
  barcode,
  setBarcode,
}) {
  const { data, getProduct, loading } = useGetProduct({ product })

  const handlePlus = () => {
    if (barcode?.barcode) addBarcode({ productId: product })
  }
  const handleChange = (e) => {
    setBarcode((prev) => ({ ...prev, barcode: e.target.value }))
  }

  useEffect(() => {
    if (product) getProduct()
  }, [product])

  const rows = [
    ...(data?.barcodes?.map((val, idx) => ({
      id: idx + 1,
      barcodeValue: val,
    })) || []),
    barcode,
  ]

  return (
    <div>
      {rows?.map(
        (item, i) =>
          item && (
            <Space key={item?.id || `new-${i}`} style={{ marginBottom: 8 }}>
              <Input
                style={{ maxWidth: 300 }}
                disabled={!item?.barcode}
                onChange={handleChange}
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
                    onClick={handlePlus}
                  />
                </Tooltip>
              )}
            </Space>
          ),
      )}
      <div>
        <Button icon={<BarcodeOutlined />} onClick={handleScan}>
          Add Barcode
        </Button>
      </div>
    </div>
  )
}

export default ProductBarcode
