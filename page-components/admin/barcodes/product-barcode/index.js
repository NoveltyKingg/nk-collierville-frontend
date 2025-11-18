import { Button, Input, Space, Tooltip, Popconfirm, Skeleton } from 'antd'
import React, { useEffect, useState } from 'react'
import {
  MinusCircleOutlined,
  CheckOutlined,
  ScanOutlined,
} from '@ant-design/icons'
import useGetProduct from '../../hooks/useGetProduct'
import BarcodeScanner from '@/utils/barcode-scanner'

function ProductBarcode({
  product,
  handleDelete,
  addBarcode,
  addBarcodeLoading,
  deleteBarcodeLoading,
  barcode,
  setBarcode,
  isModalOpen,
  setIsModalOpen,
}) {
  const [productBarcodes, setProductBarcodes] = useState([])
  const { data, getProduct, loading } = useGetProduct({ product })

  const LICENSE_KEY =
    'hP5f6pWjvwHwLm27qD5TxfGDkRnjZ7' +
    'cqYv93WCJ7SVOvV7QkJcx6+smjJaDN' +
    'Vwq7jJnXHas5i2E/BX2+qq9jAzHd52' +
    'PPDAQOfgCT2d5gWT1CjP9aX0fPzkzU' +
    'NNJU9p89yzne56i469yWdbhnQD+Hxt' +
    '7LEn3bcI9qmLSWjuHsKQxrDdJcxEIx' +
    '44FD4gMqXCSOOXhqlkU++56GD0+nR2' +
    'QvrJ1ni8YsKkH9I2ZjX/14ZExh+J26' +
    'U6eokZlURu7bvlNkSBzVZCt7iar60x' +
    'A+yM5EaOsW4TQoLxs5a6wEy791TVdL' +
    'kKP1ki/BeIjpxsqtSf69lwPv5vxrip' +
    'OEOfU1Y/2aaA==\nU2NhbmJvdFNESw' +
    'psb2NhbGhvc3QKMTc2MzE2NDc5OQo4' +
    'Mzg4NjA3Cjg=\n'

  const handlePlus = () => {
    if (barcode?.barcode)
      addBarcode({ productId: product, setProductBarcodes, setBarcode })
  }
  const handleChange = (e) => {
    setBarcode((prev) => ({ ...prev, barcode: e.target.value }))
  }

  console.log(barcode, 'barcodeee')

  useEffect(() => {
    if (product) getProduct()
  }, [product])

  const rows = [
    ...(data?.barcodes?.map((val, idx) => ({
      id: idx + 1,
      barcodeValue: val,
    })) || []),
    ...(productBarcodes?.map((val, idx) => ({
      id: idx + 1,
      barcodeValue: val,
    })) || []),
    ...(barcode ? [barcode] : []),
  ]

  console.log(data, barcode, rows, 'dattttttaaa')

  return (
    <div className='flex gap-2'>
      {loading && <Skeleton active paragraph={{ rows: 8 }} />}
      {!loading &&
        rows?.map(
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
                        // onClick={() => handleDelete(item)}
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
                      onClick={handlePlus}
                    />
                  </Tooltip>
                )}
              </Space>
            ),
        )}
      {!loading && (
        <Button
          icon={<ScanOutlined />}
          onClick={() => setIsModalOpen((prev) => !prev)}>
          Scan Barcode
        </Button>
      )}
      <BarcodeScanner
        setBarcode={setBarcode}
        licenseKey={LICENSE_KEY}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  )
}

export default ProductBarcode
