import React, { useEffect, useState } from 'react'
import { Select, Table, Button, Card, Typography, Divider } from 'antd'
import VaritiesModal from './varities-modal'
import DeleteModal from '@/components/delete-modal'
import getColumns from './columns'
import useGetProducts from '../hooks/useGetProducts'
import useGetVarities from '../hooks/useGetVarities'
import useDeleteVariety from '../hooks/useDeleteVariety'

const { Title, Text } = Typography

function AddVarities({ SUBCATEGORIES, CATEGORIES }) {
  const [category, setCategory] = useState()
  const [subCategory, setSubCategory] = useState()
  const [product, setProduct] = useState()
  const [editData, setEditData] = useState()
  const [productOptions, setProductOptions] = useState([])
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [subCategoryOptions, setSubCategoryOptions] = useState()
  const [varitiesList, setVaritiesList] = useState([])
  const [varietyId, setVarietyId] = useState()

  const { varitiesLoading } = useGetVarities({ product, setVaritiesList })
  const { deleteVariety } = useDeleteVariety({ varietyId })
  const { getProducts, productData } = useGetProducts({ subCategory })

  const handleDelete = (record) => {
    setDeleteModalOpen(true)
    setVarietyId(record?.key)
  }

  const handleEdit = (record) => {
    setEditData(record)
    setEdit(true)
    setOpen(true)
  }

  const columns = getColumns({ handleDelete, handleEdit, setVarietyId })

  const getCategory = (value) => {
    const SubCategoriesValues = SUBCATEGORIES.find(
      (item) => item?.cat_id === value,
    )?.values
    setSubCategoryOptions(SubCategoriesValues)
    setCategory(value)
    setSubCategory()
  }

  const getSubCategory = (val) => {
    setSubCategory(val)
    setProduct()
    setProductOptions()
  }

  const handleProduct = (item) => setProduct(item)
  const handleOpen = () => setOpen(!open)

  useEffect(() => {
    if (subCategory) getProducts()
  }, [subCategory])

  useEffect(() => {
    const options = productData?.map((item) => ({
      label: (
        <div className='flex justify-between'>
          <span>{item?.name}</span>
          <span className='text-xs text-slate-500'>
            {item?.active ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>
      ),
      value: item?.id,
    }))
    setProductOptions(options)
  }, [productData])

  const data = varitiesList?.map((item) => ({
    key: item?.id,
    name: item?.name,
    stock: item?.stock,
    barcodes: item?.barcodes,
    imageUrls: item?.imageUrl,
  }))

  return (
    <div className='space-y-6 p-4'>
      <div className='flex items-center justify-between'>
        <div>
          <Title level={3} className='!m-0'>
            Manage Varieties
          </Title>
          <Text type='secondary'>
            Add, edit or delete product variations for your catalog
          </Text>
        </div>
        <Button type='primary' onClick={handleOpen} disabled={!product}>
          Add New Variety
        </Button>
      </div>

      <Card className='rounded-2xl shadow-sm'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <Text type='secondary'>Category</Text>
            <Select
              style={{ width: '100%' }}
              value={category}
              options={CATEGORIES}
              onSelect={getCategory}
              placeholder='Select category'
            />
          </div>
          <div>
            <Text type='secondary'>Sub-Category</Text>
            <Select
              style={{ width: '100%' }}
              value={subCategory}
              options={subCategoryOptions}
              onSelect={getSubCategory}
              placeholder='Select sub-category'
            />
          </div>
          <div>
            <Text type='secondary'>Product</Text>
            <Select
              style={{ width: '100%' }}
              value={product}
              options={productOptions}
              onSelect={handleProduct}
              placeholder='Select product'
            />
          </div>
        </div>
      </Card>

      <Card className='rounded-2xl shadow-sm'>
        <Divider orientation='left'>Varieties List</Divider>
        <Table
          columns={columns}
          dataSource={data || []}
          loading={varitiesLoading}
          pagination={{ pageSize: 10 }}
          rowKey='key'
        />
      </Card>

      {(open || edit) && (
        <VaritiesModal
          open={open}
          setOpen={setOpen}
          edit={edit}
          handleOpen={handleOpen}
          product={product}
          editData={editData}
          setEdit={setEdit}
          setVaritiesList={setVaritiesList}
        />
      )}
      {deleteModalOpen && (
        <DeleteModal
          open={deleteModalOpen}
          setOpen={setDeleteModalOpen}
          handleDelete={deleteVariety}
        />
      )}
    </div>
  )
}

export default AddVarities
