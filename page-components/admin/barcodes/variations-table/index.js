import React, { useState } from 'react'
import useGetColumns from '../columns'
import BarcodeScanner from '@/utils/barcode-scanner'
import { Skeleton, Table } from 'antd'

export default function VariationsTable({
  data,
  productId,
  varitiesLoading,
  barcode,
  setBarcode,
  deleteBarcodeLoading,
  addBarcodeLoading,
  addBarcode,
  handleDelete,
  onScanClick,
  activeVariationId,
  isModalOpen,
  setIsModalOpen,
}) {
  const containerId = activeVariationId
    ? `barcode-scanner-${activeVariationId}`
    : 'barcode-scanner-idle'

  const RAW_LICENSE_KEY = process.env.NEXT_PUBLIC_SCANNER_LICENSE_KEY
  const LICENSE_KEY = RAW_LICENSE_KEY.replace(/\\n/g, '\n')

  const columns = useGetColumns({
    product: productId,
    addBarcode: ({ productId, variationId }) => {
      addBarcode({ productId, variationId })
    },
    barcode,
    setBarcode,
    handleDelete: (item) => {
      handleDelete(item)
    },
    addBarcodeLoading,
    deleteBarcodeLoading,
    onScanClick,
  })

  return (
    <>
      {varitiesLoading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          rowKey='key'
          size='small'
          pagination={false}
        />
      )}

      <BarcodeScanner
        licenseKey={LICENSE_KEY}
        setBarcode={setBarcode}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        containerId={containerId}
      />
    </>
  )
}
