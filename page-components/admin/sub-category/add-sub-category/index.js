import React, { useEffect, useState } from 'react'
import { Button, Input, Select, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import useCreateSubCategory from '../../hooks/useCreateSubCategory'
import { dummyRequest } from '@/utils/dummyRequest'

function AddSubCategory({
  CATEGORIES,
  subCategoryDetails,
  disabled,
  setDisabled,
  selectedCategory,
}) {
  const [fileList, setFileList] = useState()
  const [category, setCategory] = useState()
  const [subCategoryName, setSubCategoryName] = useState()

  const { createSubCategory, loading } = useCreateSubCategory({ category })

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList)

  const handleSubmit = () => {
    const formData = new FormData()
    fileList?.forEach((item) =>
      item?.originFileObj
        ? formData?.append('image', item?.originFileObj)
        : formData.append('imageUrl', item?.url),
    )
    formData?.append('name', subCategoryName)
    subCategoryDetails?.value &&
      formData?.append('id', subCategoryDetails?.value)
    createSubCategory({ formData })
  }

  useEffect(() => {
    if (subCategoryDetails) {
      setCategory(selectedCategory)
      setSubCategoryName(subCategoryDetails?.label)
      const images = [
        {
          key: 1,
          name: 'image - 1',
          status: 'done',
          url: subCategoryDetails?.imageUrl,
        },
      ]
      setFileList(images)
    }
  }, [])

  return (
    <div>
      <div>
        Select Category:{' '}
        <Select
          style={{ width: 200 }}
          onSelect={(val) => setCategory(val)}
          options={CATEGORIES}
          disabled={disabled}
          value={category}
        />
      </div>
      <div>
        Sub Category Name:{' '}
        <Input
          style={{ width: 200 }}
          onChange={(e) => setSubCategoryName(e.target.value)}
          disabled={disabled}
          value={subCategoryName}
        />
      </div>
      <div>
        Sub Category Images:{' '}
        <Upload
          listType='picture-card'
          maxCount={10}
          customRequest={dummyRequest}
          multiple
          fileList={fileList}
          onChange={handleChange}
          disabled={disabled}>
          {fileList?.length >= 10 ? null : (
            <Button style={{ border: 0, background: 'none' }}>
              {' '}
              <PlusOutlined />
              <div>Upload</div>
            </Button>
          )}
        </Upload>
      </div>
      <div
        style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type='primary'
          onClick={handleSubmit}
          loading={loading}
          disabled={loading}>
          Submit
        </Button>
      </div>
    </div>
  )
}

export default AddSubCategory
