import React, { useState } from 'react'
import { Select, Collapse } from 'antd'
import {
  CaretRightOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import AddSubCategory from '../add-sub-category'
import DeleteModal from '@/components/delete-modal'
import useDeleteSubCategory from '../../hooks/useDeleteSubCategory'
import useGetCategories from '../../hooks/useGetCategory'

function EditSubCatgeory({ CATEGORIES, SUBCATEGORIES, setData }) {
  const [category, setCategory] = useState()
  const [disabled, setDisabled] = useState(true)
  const [subCategoryId, setSubCategoryId] = useState()
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const { getCategories } = useGetCategories({ setData })

  const { deleteSubCategory } = useDeleteSubCategory({
    subCategoryId,
    setSubCategoryId,
    getCategories,
  })

  const genExtra = (item) => (
    <div>
      <EditOutlined
        onClick={(event) => {
          setDisabled(!disabled)
          event.stopPropagation()
        }}
      />
      <DeleteOutlined
        onClick={(event) => {
          setSubCategoryId(item?.value)
          setOpenDeleteModal(true)
          event.stopPropagation()
        }}
      />
    </div>
  )

  const items = SUBCATEGORIES?.filter(
    (item) => item?.cat_id === category,
  )[0]?.values?.map((item) => ({
    key: item?.value,
    label: item?.label,
    extra: genExtra(item),
    children: (
      <div>
        <AddSubCategory
          CATEGORIES={CATEGORIES}
          subCategoryDetails={item}
          disabled={disabled}
          setDisabled={setDisabled}
          selectedCategory={category}
        />
      </div>
    ),
  }))

  const getCategory = (value) => {
    setCategory(value)
  }

  const handleDelete = async () => {
    await deleteSubCategory()
    items.splice(
      items.filter((item) => item?.key === subCategoryId),
      1,
    )
  }

  const handleCancel = () => {
    setSubCategoryId()
  }

  return (
    <div>
      <div>
        Category:{' '}
        <Select
          style={{ width: 200 }}
          value={category}
          options={CATEGORIES}
          onSelect={getCategory}
        />
      </div>
      <Collapse
        items={items || []}
        defaultActiveKey={['1']}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      />
      {openDeleteModal && (
        <DeleteModal
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
          handleDelete={handleDelete}
          handleCancel={handleCancel}
        />
      )}
    </div>
  )
}

export default EditSubCatgeory
