/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useMemo, useState } from 'react'
import { Button, Card, Select, Space, Typography } from 'antd'
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import useGetProducts from '../hooks/useGetProducts'
import useGetVarities from '../hooks/useGetVarities'
// import useGetColumns from './columns'
import useAddBarcode from '../hooks/useAddBarcode'
import useDeleteBarcode from '../hooks/useDeleteBarcode'
import DebounceSelect from '@/components/debounce-select'
import useQuerySearch from '../hooks/useQuerySearch'
import ProductBarcode from './product-barcode'
import VariationsTable from './variations-table'

const { Title, Text } = Typography

function Barcodes({ CATEGORIES, SUBCATEGORIES }) {
  const [subCategoryOptions, setSubCategoryOptions] = useState([])
  const [category, setCategory] = useState()
  const [subCategory, setSubCategory] = useState()
  const [product, setProduct] = useState()
  const [varitiesList, setVaritiesList] = useState()
  // const [openBarcode, setOpenBarcode] = useState({ status: false })
  // const [openBarcodeModal, setOpenBarcodeModal] = useState(false)
  const [barcode, setBarcode] = useState()
  const [deletedBarcode, setDeletedBarcode] = useState()
  const [search, setSearch] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeVariationId, setActiveVariationId] = useState(null)

  // const [variationId, setVariationId] = useState()
  // const [isModalOpen, setIsModalOpen] = useState(false)

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

  const onScanClick = (variationId) => {
    setActiveVariationId(variationId)
    setBarcode({ id: 'new', variationId, barcode: '' })
    setIsModalOpen(true)
  }

  // const COLUMNS = useGetColumns({
  //   handleScan: (e, record) => handleScan(e, record),
  //   product,
  //   addBarcode,
  //   openBarcode,
  //   barcode,
  //   variationId,
  //   addBarcodeLoading,
  //   deleteBarcodeLoading,
  //   handleDelete: (item) => setDeletedBarcode(item?.barcodeValue),
  //   setBarcode,
  //   setIsModalOpen,
  //   isModalOpen,
  // })

  const handleDelete = (item) => {
    setDeletedBarcode(item?.barcodeValue)
  }

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

  // const handleScan = (e, record) => {
  //   if (!openBarcode?.status) {
  //     setVariationId(record?.key)
  //     setOpenBarcodeModal(true)
  //     setOpenBarcode({ status: true })
  //   } else {
  //     setOpenBarcodeModal(false)
  //     setOpenBarcode({ status: false })
  //   }
  // }

  // const handleBarcodeModal = () => {
  //   setOpenBarcodeModal((prev) => !prev)
  //   setOpenBarcode((prev) => ({ status: !prev.status }))
  // }

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

  // useEffect(() => {
  //   if (variationId) {
  //     setBarcode((prev) => ({ ...prev, variationId }))
  //     setVariationId(undefined)
  //   }
  // }, [barcode])

  useEffect(() => {
    if (subCategory) getProducts()
  }, [subCategory])

  console.log(isVariationExist, 'isVariationExist')

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
        {isVariationExist ? (
          <VariationsTable
            data={data}
            varitiesLoading={varitiesLoading}
            productId={product}
            barcode={barcode}
            setBarcode={setBarcode}
            deleteBarcodeLoading={deleteBarcodeLoading}
            addBarcodeLoading={addBarcodeLoading}
            addBarcode={addBarcode}
            handleDelete={handleDelete}
            onScanClick={onScanClick}
            activeVariationId={activeVariationId}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        ) : (
          <ProductBarcode
            product={product}
            productData={productData}
            handleDelete={(item) => setDeletedBarcode(item?.barcodeValue)}
            addBarcode={addBarcode}
            barcode={barcode}
            deleteBarcodeLoading={deleteBarcodeLoading}
            addBarcodeLoading={addBarcodeLoading}
            setBarcode={setBarcode}
            onScanClick={onScanClick}
            activeVariationId={activeVariationId}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        )}
      </Card>
    </div>
  )
}

export default Barcodes
