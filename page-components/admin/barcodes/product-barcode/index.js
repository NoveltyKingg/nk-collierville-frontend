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

  const RAW_LICENSE_KEY = process.env.NEXT_PUBLIC_SCANNER_LICENSE_KEY
  const LICENSE_KEY = RAW_LICENSE_KEY.replace(/\\n/g, '\n')

  const handlePlus = () => {
    if (barcode?.barcode)
      addBarcode({ productId: product, setProductBarcodes, setBarcode })
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
    ...(productBarcodes?.map((val, idx) => ({
      id: idx + 1,
      barcodeValue: val,
    })) || []),
    ...(barcode ? [barcode] : []),
  ]

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
