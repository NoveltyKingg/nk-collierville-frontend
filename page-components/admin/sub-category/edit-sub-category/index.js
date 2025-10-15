/* eslint-disable react/no-unstable-nested-components */
import React, { useMemo, useState } from 'react'
import {
  Button,
  Card,
  Collapse,
  Divider,
  Empty,
  Image,
  Input,
  Select,
  Space,
  Tooltip,
  Typography,
  Skeleton,
} from 'antd'
import {
  CaretRightOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons'

import AddSubCategory from '../add-sub-category'
import DeleteModal from '@/components/delete-modal'
import useDeleteSubCategory from '../../hooks/useDeleteSubCategory'
import useGetCategories from '../../hooks/useGetCategory'

const { Title, Text } = Typography

function EditSubCatgeory({ CATEGORIES, SUBCATEGORIES, setData }) {
  const [category, setCategory] = useState()
  const [search, setSearch] = useState('')
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [subCategoryId, setSubCategoryId] = useState()
  const [disabledMap, setDisabledMap] = useState({})

  const { getCategories, loading: refreshing } = useGetCategories({ setData })

  const { deleteSubCategory, loading: deleting } = useDeleteSubCategory({
    subCategoryId,
    setSubCategoryId,
    getCategories,
  })

  const toggleEdit = (id) =>
    setDisabledMap((prev) => ({ ...prev, [id]: !prev[id] }))

  const selectedSubcats =
    SUBCATEGORIES?.find((sc) => sc?.cat_id === category)?.values || []

  const filteredSubcats = useMemo(() => {
    if (!search?.trim()) return selectedSubcats
    const q = search.toLowerCase()
    return selectedSubcats.filter(
      (s) =>
        String(s?.label || '')
          .toLowerCase()
          .includes(q) ||
        String(s?.value || '')
          .toLowerCase()
          .includes(q),
    )
  }, [selectedSubcats, search])

  const collapseItems = filteredSubcats.map((item) => ({
    key: item?.value,
    label: (
      <div className='flex items-center justify-between gap-3 w-full'>
        <div className='flex items-center gap-3 min-w-0'>
          <div className='w-[40px] h-[40px] rounded-md overflow-hidden bg-[#f5f5f5] grid place-items-center'>
            {item?.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item?.label || 'Sub-category'}
                width={40}
                height={40}
                preview={false}
              />
            ) : (
              <div className='w-[28px] h-[28px] bg-[#eaeaea] rounded' />
            )}
          </div>
          <div className='min-w-0'>
            <div className='font-medium truncate'>{item?.label}</div>
            <div className='text-xs text-slate-500 truncate'>
              ID: {item?.value}
            </div>
          </div>
        </div>
        <Space size='small' wrap>
          <Tooltip title={disabledMap[item?.value] ? 'Lock' : 'Edit'}>
            <Button
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation()
                toggleEdit(item?.value)
              }}
              type={disabledMap[item?.value] ? 'primary' : 'default'}
            />
          </Tooltip>
          <Tooltip title='Delete'>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation()
                setSubCategoryId(item?.value)
                setOpenDeleteModal(true)
              }}
            />
          </Tooltip>
        </Space>
      </div>
    ),
    children: (
      <div className='pt-2'>
        <AddSubCategory
          CATEGORIES={CATEGORIES}
          subCategoryDetails={item}
          disabled={!disabledMap[item?.value]}
          setDisabled={() => {}}
          selectedCategory={category}
        />
      </div>
    ),
  }))

  const collapseProps = {
    bordered: false,
    expandIcon: ({ isActive }) => (
      <CaretRightOutlined rotate={isActive ? 90 : 0} />
    ),
    className:
      'bg-white [&_.ant-collapse-item]:rounded-lg [&_.ant-collapse-item]:overflow-hidden',
  }

  const handleDelete = async () => {
    await deleteSubCategory()
    setOpenDeleteModal(false)
    getCategories()
  }

  const handleCancel = () => setSubCategoryId(undefined)

  return (
    <div className='space-y-6'>
      <div>
        <Title level={3} className='!m-0'>
          Edit Sub-Categories
        </Title>
        <Text type='secondary'>
          Choose a category, then edit or delete its sub-categories
        </Text>
      </div>

      <Card className='rounded-2xl shadow-sm'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <Text type='secondary'>Category</Text>
            <Select
              placeholder='Select category'
              style={{ width: '100%' }}
              value={category}
              options={CATEGORIES}
              onChange={setCategory}
            />
          </div>
          <div className='md:col-span-2'>
            <Text type='secondary'>Search sub-categories</Text>
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder='Search by name or ID'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <Card className='rounded-2xl shadow-sm'>
        <Divider className='!my-3' />
        {!category ? (
          <Empty description='Select a category to manage its sub-categories' />
        ) : refreshing ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : !collapseItems.length ? (
          <Empty description='No sub-categories found' />
        ) : (
          <Collapse
            items={collapseItems}
            defaultActiveKey={[collapseItems[0]?.key]}
            {...collapseProps}
          />
        )}
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

export default EditSubCatgeory
