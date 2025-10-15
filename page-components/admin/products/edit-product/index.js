/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Checkbox,
  Collapse,
  Divider,
  Empty,
  Input,
  Select,
  Space,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  Skeleton,
  Popconfirm,
} from 'antd'
import {
  CaretRightOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons'

import useGetProducts from '../../hooks/useGetProducts'
import AddProductForm from '../add-product-form'
import DeleteModal from '@/components/delete-modal'
import useDeleteProduct from '../../hooks/useDeleteProduct'
import useUpdateProductInStock from '../../hooks/useUpdateProductInStock'

const { Title, Text } = Typography

function EditProduct({ SUBCATEGORIES, CATEGORIES, FILTERS }) {
  const [category, setCategory] = useState()
  const [subCategory, setSubCategory] = useState()
  const [productId, setProductId] = useState()
  const [disabled, setDisabled] = useState({})
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [subCategoryOptions, setSubCategoryOptions] = useState([])
  const [products, setProducts] = useState([])
  const [activeProducts, setActiveProducts] = useState([])
  const [inactiveProducts, setInactiveProducts] = useState([])

  const { getProducts, productData, loading } = useGetProducts({
    subCategory,
    setProducts,
  })

  const { deleteProduct, loading: deleting } = useDeleteProduct({
    productId,
    setProductId,
    getProducts,
  })

  const { updateProductInStock, loading: updatingStock } =
    useUpdateProductInStock()

  const statusTag = (isActive) =>
    isActive ? (
      <Tag color='green'>ACTIVE</Tag>
    ) : (
      <Tag color='default'>INACTIVE</Tag>
    )

  const handleUpdateProductInStock = (checked, item) => {
    updateProductInStock({ status: checked, productId: item?.id })
  }

  const handleCategoryChange = (value) => {
    const sub = SUBCATEGORIES.find((i) => i?.cat_id === value)?.values || []
    setSubCategoryOptions(sub)
    setCategory(value)
    setSubCategory(undefined)
    setProducts([])
    setActiveProducts([])
    setInactiveProducts([])
  }

  const handleSubCategoryChange = (val) => {
    setSubCategory(val)
  }

  const toggleEdit = (item) => {
    setDisabled((prev) => ({ ...prev, [item?.id]: !prev[item?.id] }))
  }

  const askDelete = (item) => {
    setProductId(item?.id)
    setOpenDeleteModal(true)
  }

  const rawItems = useMemo(() => {
    if (!productData) return []
    return productData.map((item) => ({
      key: item?.id,
      id: item?.id,
      active: item?.active,
      label: (
        <div className='flex items-center justify-between gap-3'>
          <div className='min-w-0'>
            <div className='font-medium truncate'>{item?.name}</div>
            <div className='text-xs text-slate-500 truncate'>
              ID: {item?.id}
            </div>
          </div>
          <Space size='small' wrap>
            {statusTag(item?.active)}
            <Checkbox
              onChange={(e) => {
                e.stopPropagation()
                handleUpdateProductInStock(e.target.checked, item)
              }}
              defaultChecked={!item?.inStock}
              disabled={updatingStock}>
              Mark as Out of stock
            </Checkbox>
            <Tooltip title='Edit'>
              <Button
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleEdit(item)
                }}
              />
            </Tooltip>
            <Tooltip title='Delete'>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={(e) => {
                  e.stopPropagation()
                  askDelete(item)
                }}
              />
            </Tooltip>
          </Space>
        </div>
      ),
      children: (
        <div className='pt-2'>
          <AddProductForm
            SUBCATEGORIES={SUBCATEGORIES}
            CATEGORIES={CATEGORIES}
            productDetails={item}
            disabled={
              disabled[item?.id] !== undefined ? !disabled[item?.id] : true
            }
            setDisabled={setDisabled}
            categoryId={category}
            subCategoryId={subCategory}
            FILTERS={FILTERS}
          />
        </div>
      ),
    }))
  }, [
    productData,
    disabled,
    updatingStock,
    category,
    subCategory,
    SUBCATEGORIES,
    CATEGORIES,
    FILTERS,
  ])

  useEffect(() => {
    if (!rawItems?.length) {
      setProducts([])
      setActiveProducts([])
      setInactiveProducts([])
      return
    }
    const q = (searchText || '').trim().toLowerCase()
    const filtered = q
      ? rawItems.filter(
          (i) =>
            String(i?.id).toLowerCase().includes(q) ||
            String(i?.label?.props?.children?.[0]?.props?.children || '')
              .toLowerCase()
              .includes(q),
        )
      : rawItems

    setProducts(filtered)

    const active = filtered.filter((i) => i.active === true)
    const inactive = filtered.filter((i) => i.active !== true)
    setActiveProducts(active)
    setInactiveProducts(inactive)
  }, [rawItems, searchText])

  useEffect(() => {
    if (subCategory) getProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subCategory])

  const refresh = () => {
    if (subCategory) getProducts()
  }

  const collapseProps = {
    bordered: false,
    expandIcon: ({ isActive }) => (
      <CaretRightOutlined rotate={isActive ? 90 : 0} />
    ),
    className:
      'bg-white [&_.ant-collapse-item]:rounded-lg [&_.ant-collapse-item]:overflow-hidden',
  }

  const tabItems = [
    {
      label: `Active (${activeProducts.length})`,
      key: 'active',
      children: loading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : activeProducts.length ? (
        <Collapse items={activeProducts} {...collapseProps} />
      ) : (
        <Empty description='No active products' />
      ),
    },
    {
      label: `Inactive (${inactiveProducts.length})`,
      key: 'inactive',
      children: loading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : inactiveProducts.length ? (
        <Collapse items={inactiveProducts} {...collapseProps} />
      ) : (
        <Empty description='No inactive products' />
      ),
    },
  ]

  const handleDelete = () => deleteProduct()
  const handleCancel = () => setProductId(undefined)

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <Title level={3} className='!m-0'>
            Edit Products
          </Title>
          <Text type='secondary'>
            Search, edit, or delete products by category and sub-category
          </Text>
        </div>
        <Button onClick={refresh} icon={<ReloadOutlined />} loading={loading}>
          Refresh
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <Text type='secondary'>Category</Text>
          <Select
            style={{ width: '100%' }}
            value={category}
            options={CATEGORIES}
            onChange={handleCategoryChange}
            placeholder='Select category'
          />
        </div>
        <div>
          <Text type='secondary'>Sub-Category</Text>
          <Select
            style={{ width: '100%' }}
            value={subCategory}
            options={subCategoryOptions}
            onChange={handleSubCategoryChange}
            placeholder='Select sub-category'
            disabled={!category}
          />
        </div>
        <div>
          <Text type='secondary'>Search</Text>
          <Input
            allowClear
            placeholder='Search by name or ID'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={() => setSearchText((s) => s)}
          />
        </div>
      </div>

      <Card className='rounded-2xl shadow-sm'>
        <Tabs
          defaultActiveKey='active'
          type='card'
          size='large'
          items={tabItems}
        />
      </Card>

      {openDeleteModal && (
        <DeleteModal
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
          handleDelete={handleDelete}
          handleCancel={handleCancel}
          loading={deleting}
        />
      )}
    </div>
  )
}

export default EditProduct
