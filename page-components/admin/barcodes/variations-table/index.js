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

  const LICENSE_KEY =
    'pjHhzYwVGOycuaz9Vr/IwOZNVFgMta' +
    'RPPFoIGxdvIdzPST4qP9jnBFuEVIBo' +
    'sKArmowREsUJxT3t9BpHkrzPIMJzoP' +
    '/pUPf02JUImtOJtRQlaOS+x1sNIGhT' +
    'mJIbJ+qYLSHOiGAVMTEwuOKebg+ed+' +
    'tH2r72u49TztZjyt/sHrmDZBio2ARQ' +
    'pFKOJIR/v4q6DEuBxNDKRa8Smp0Nan' +
    'VHOqGPtOZOnIHogNffkvZMsEX8BCCa' +
    'rqiIHW7pj3JXBiqjx823D62Rg3NTqa' +
    'dGO/CSqosXiwSN1JCVZwKdZM01CyLw' +
    '3JtXjD1UkvUu8tclo5Wl8Ph0oRJw+z' +
    'mgYuD5MJIqhA==\nU2NhbmJvdFNESw' +
    'psb2NhbGhvc3QKMTc2NDAyODc5OQo4' +
    'Mzg4NjA3Cjg=\n'

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
