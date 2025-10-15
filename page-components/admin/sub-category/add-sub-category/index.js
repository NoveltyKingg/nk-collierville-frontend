/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react'
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Select,
  Upload,
  Typography,
  Space,
} from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import useCreateSubCategory from '../../hooks/useCreateSubCategory'
import { dummyRequest } from '@/utils/dummyRequest'

const { Title, Text } = Typography

function AddSubCategory({
  CATEGORIES,
  subCategoryDetails,
  disabled,
  setDisabled,
  selectedCategory,
}) {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState([])
  const [category, setCategory] = useState()
  const [subCategoryName, setSubCategoryName] = useState('')

  const { createSubCategory, loading } = useCreateSubCategory({ category })

  useEffect(() => {
    if (!subCategoryDetails) return
    const initialCat = selectedCategory
    const initialName = subCategoryDetails?.label || ''
    setCategory(initialCat)
    setSubCategoryName(initialName)

    form.setFieldsValue({
      category: initialCat,
      name: initialName,
    })

    const images = subCategoryDetails?.imageUrl
      ? [
          {
            uid: '1',
            name: 'image-1',
            status: 'done',
            url: subCategoryDetails?.imageUrl,
          },
        ]
      : []
    setFileList(images)
  }, [subCategoryDetails, selectedCategory, form])

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList)

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const formData = new FormData()

    fileList?.forEach((f) => {
      if (f.originFileObj) {
        formData.append('image', f.originFileObj)
      } else if (f.url) {
        formData.append('imageUrl', f.url)
      }
    })

    formData.append('name', values?.name)
    formData.append('categoryId', values?.category)

    if (subCategoryDetails?.value) {
      formData.append('id', subCategoryDetails.value)
    }

    createSubCategory({ formData })
  }

  const resetForm = () => {
    form.resetFields()
    setCategory(undefined)
    setSubCategoryName('')
    setFileList([])
  }

  return (
    <Card className='rounded-2xl shadow-sm'>
      <div className='flex items-center justify-between'>
        <div>
          <Title level={4} className='!m-0'>
            {subCategoryDetails ? 'Edit Sub-Category' : 'Add Sub-Category'}
          </Title>
          <Text type='secondary'>
            {subCategoryDetails
              ? 'Update the name, category, or image of this sub-category'
              : 'Create a new sub-category under a category and upload an image'}
          </Text>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={resetForm}
            disabled={loading}>
            Reset
          </Button>
        </Space>
      </div>

      <Divider className='!my-3' />

      <Form
        form={form}
        layout='vertical'
        initialValues={{
          category: category,
          name: subCategoryName,
        }}
        disabled={disabled}
        onFinish={handleSubmit}>
        <Form.Item
          label='Category'
          name='category'
          rules={[{ required: true, message: 'Please select a category' }]}>
          <Select
            placeholder='Select Category'
            options={CATEGORIES}
            value={category}
            onChange={(val) => setCategory(val)}
          />
        </Form.Item>

        <Form.Item
          label='Sub-Category Name'
          name='name'
          rules={[
            { required: true, message: 'Please enter sub-category name' },
          ]}>
          <Input
            placeholder='Enter sub-category name'
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
          />
        </Form.Item>

        <Form.Item label='Image'>
          <Upload
            listType='picture-card'
            maxCount={1}
            customRequest={dummyRequest}
            multiple={false}
            fileList={fileList}
            onChange={handleChange}
            disabled={disabled}>
            {fileList?.length >= 1 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
          <Text type='secondary'>
            Recommended: square image (e.g., 600×600) for consistent display.
          </Text>
        </Form.Item>

        {!disabled && (
          <Form.Item className='!mb-0'>
            <div className='flex justify-end'>
              <Button
                type='primary'
                htmlType='submit'
                loading={loading}
                disabled={loading}>
                Submit
              </Button>
            </div>
          </Form.Item>
        )}
      </Form>
    </Card>
  )
}

export default AddSubCategory
