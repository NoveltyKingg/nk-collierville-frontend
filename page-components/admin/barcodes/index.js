/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  Button,
  Card,
  Divider,
  Empty,
  Modal,
  Select,
  Space,
  Table,
  Typography,
  Skeleton,
} from 'antd'
import {
  BarcodeOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons'

import useGetProducts from '../hooks/useGetProducts'
import useGetVarities from '../hooks/useGetVarities'
import useGetColumns from './columns'
import useAddBarcode from '../hooks/useAddBarcode'
import useDeleteBarcode from '../hooks/useDeleteBarcode'
import DebounceSelect from '@/components/debounce-select'
import useQuerySearch from '../hooks/useQuerySearch'
import ProductBarcode from './product-barcode'
import BarcodeScanner from '../../../components/barcode-scanner'

const { Title, Text } = Typography

const BarcodeScannerModal = dynamic(
  () => import('../../../components/barcode-scanner'),
  { ssr: false },
)

function Barcodes({ CATEGORIES, SUBCATEGORIES }) {
  const [subCategoryOptions, setSubCategoryOptions] = useState([])
  const [category, setCategory] = useState()
  const [subCategory, setSubCategory] = useState()
  const [product, setProduct] = useState()
  const [varitiesList, setVaritiesList] = useState()
  const [openBarcode, setOpenBarcode] = useState({ status: false })
  const [openBarcodeModal, setOpenBarcodeModal] = useState(false)
  const [barcode, setBarcode] = useState()
  const [deletedBarcode, setDeletedBarcode] = useState()
  const [search, setSearch] = useState()
  const [variationId, setVariationId] = useState()
  const [targetId, setTargetId] = useState('')

  const {
    productData,
    getProducts,
    loading: loadingProducts,
  } = useGetProducts({ subCategory })
  const { getVarities, varitiesLoading, isVariationExist } = useGetVarities({
    product,
    setVaritiesList,
  })
  const { addBarcode, addBarcodeLoading } = useAddBarcode({
    barcode: barcode?.barcode,
    getVarities,
  })
  const { deleteBarcode, deleteBarcodeLoading } = useDeleteBarcode({
    barcode: deletedBarcode,
    getVarities,
    setDeletedBarcode,
  })
  const { queryTrigger } = useQuerySearch()

  const COLUMNS = useGetColumns({
    handleScan: (e, record) => handleScan(e, record),
    product,
    addBarcode,
    openBarcode,
    barcode,
    variationId,
    addBarcodeLoading,
    deleteBarcodeLoading,
    handleDelete: (item) => setDeletedBarcode(item?.barcodeValue),
    setBarcode,
  })

  const data = useMemo(
    () =>
      varitiesList?.map((item) => ({
        key: item?.id,
        name: item?.name,
        barcodes: item?.barcodes,
        imageUrls: item?.imageUrl,
      })) || [],
    [varitiesList],
  )

  const handleCategorySelect = (value) => {
    const sub = SUBCATEGORIES.find((i) => i?.cat_id === value)?.values || []
    setSubCategoryOptions(sub)
    setCategory(value)
    setSubCategory(undefined)
    setProduct(undefined)
    setVaritiesList(undefined)
  }

  const handleSubCategorySelect = (val) => {
    setSubCategory(val)
    setProduct(undefined)
    setVaritiesList(undefined)
  }

  const handleSelectProduct = (val) => {
    setProduct(val)
  }

  const handleScan = (e, record) => {
    if (!openBarcode?.status) {
      setVariationId(record?.key)
      setOpenBarcodeModal(true)
      setOpenBarcode({ status: true })
    } else {
      setOpenBarcodeModal(false)
      setOpenBarcode({ status: false })
    }
  }

  const handleBarcodeModal = () => {
    setOpenBarcodeModal((prev) => !prev)
    setOpenBarcode((prev) => ({ status: !prev.status }))
  }

  const refresh = () => {
    if (product) getVarities()
    if (subCategory) getProducts()
  }

  useEffect(() => {
    if (deletedBarcode) deleteBarcode()
  }, [deletedBarcode])

  useEffect(() => {
    setBarcode(undefined)
  }, [varitiesList])

  useEffect(() => {
    if (variationId) {
      setBarcode((prev) => ({ ...prev, variationId }))
      setVariationId(undefined)
    }
  }, [barcode])

  useEffect(() => {
    if (subCategory) getProducts()
  }, [subCategory])

  return (
    <div className='space-y-6 flex flex-col gap-2'>
      <div className='flex items-center justify-between'>
        <div>
          <Title level={3} className='!m-0'>
            Barcodes
          </Title>
          <Text type='secondary'>
            Assign, scan, or remove barcodes for products and their variations
          </Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={refresh}>
            Refresh
          </Button>
        </Space>
      </div>

      <Card className='rounded-2xl shadow-sm'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-3'>
          <Select
            placeholder='Select Category'
            style={{ width: '100%' }}
            value={category}
            options={CATEGORIES}
            onSelect={handleCategorySelect}
          />
          <Select
            placeholder='Select Sub Category'
            style={{ width: '100%' }}
            value={subCategory}
            options={subCategoryOptions}
            onSelect={handleSubCategorySelect}
            disabled={!category}
          />
          {category ? (
            <Select
              placeholder='Select Product'
              style={{ width: '100%' }}
              value={product}
              loading={loadingProducts}
              onSelect={handleSelectProduct}
              options={productData?.map((item) => ({
                label: item?.name,
                value: item?.id,
              }))}
              showSearch
              optionFilterProp='label'
            />
          ) : (
            <DebounceSelect
              value={search}
              showSearch
              placeholder='Search product'
              fetchOptions={queryTrigger}
              handleSelect={handleSelectProduct}
              onChange={(newValue) => setSearch(newValue)}
              admin
              style={{ width: '100%' }}
              suffixIcon={<SearchOutlined />}
            />
          )}
        </div>
      </Card>

      <Card className='rounded-2xl shadow-sm'>
        {!product ? (
          <Empty description='Pick a product to manage barcodes' />
        ) : varitiesLoading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : isVariationExist ? (
          <Table
            columns={COLUMNS}
            dataSource={data}
            loading={varitiesLoading}
            pagination={false}
          />
        ) : (
          <ProductBarcode
            product={product}
            productData={productData}
            handleDelete={(item) => setDeletedBarcode(item?.barcodeValue)}
            addBarcode={addBarcode}
            handleScan={() => handleScan({}, { key: undefined })}
            barcode={barcode}
            deleteBarcodeLoading={deleteBarcodeLoading}
            addBarcodeLoading={addBarcodeLoading}
            setBarcode={setBarcode}
          />
        )}
      </Card>

      <Modal
        title={
          <div className='flex items-center gap-2'>
            <BarcodeOutlined /> <span>Scan Barcode</span>
          </div>
        }
        open={openBarcodeModal}
        onCancel={handleBarcodeModal}
        footer={null}>
        <BarcodeScanner
          open={openBarcodeModal}
          onClose={handleBarcodeModal}
          license='DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9'
          mode='scan-id'
          onResult={({ code }) => {
            if (code) {
              setTargetId(code)
              message.success(`Scanned: ${code}`)
            }
          }}
        />
      </Modal>
    </div>
  )
}

export default Barcodes
