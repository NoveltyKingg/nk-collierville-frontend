/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react'
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import {
  Select,
  Form,
  Input,
  InputNumber,
  Button,
  Space,
  Checkbox,
  Upload,
  Card,
  Divider,
  Typography,
  Row,
  Col,
} from 'antd'
import useSubmitProduct from '../../hooks/useSubmitProduct'
import { dummyRequest } from '@/utils/dummyRequest'

const { Title, Text } = Typography
const { TextArea } = Input

const PRICE_CATEGORY_OPTIONS = ['A', 'B', 'C', 'D'].map((i) => ({
  label: i,
  value: i,
}))

function AddProductForm({
  SUBCATEGORIES,
  CATEGORIES,
  FILTERS,
  productDetails,
  disabled,
  setDisabled = () => {},
  categoryId,
  subCategoryId,
}) {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState([])
  const [newArrival, setNewArrival] = useState(false)
  const [preOrder, setPreOrder] = useState(false)
  const [subCategoryOptions, setSubCategoryOptions] = useState([])
  // const [filterOptions, setFilterOptions] = useState()
  // const [subFilterOptions, setSubFilterOptions] = useState()
  const [filters, setFilters] = useState()
  // const [subFilter, setSubFilter] = useState()

  const { submitProduct, loading } = useSubmitProduct()

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList)

  const dataMod = (value) =>
    JSON.stringify(
      value.reduce((acc, { category, value }) => {
        acc[category] = value
        return acc
      }, {}),
    )

  const dataModFilters = (value) => {
    const transformed = {}
    value.forEach((item) => {
      if (item.value1) {
        transformed[item.category] = transformed[item.category] || {}
        transformed[item.category][item.value] =
          transformed[item.category][item.value] || []
        transformed[item.category][item.value].push(item.value1)
      } else {
        transformed[item.category] = [
          ...(transformed[item.category] || []),
          ...(Array.isArray(item.value) ? item.value : [item.value]),
        ]
      }
    })
    return JSON.stringify(transformed)
  }

  const getCategory = (value) => {
    const subCategories =
      SUBCATEGORIES.find((item) => item?.cat_id === value)?.values || []
    const filterValues = FILTERS.find((item) => item?.cat_id === value)?.filters

    setSubCategoryOptions(subCategories)
    setFilters({
      categories: filterValues?.map((i) => ({ label: i.key, value: i.key })),
      options: filterValues,
    })
    form.setFieldValue('category', value)
  }

  useEffect(() => {
    if (!productDetails) return
    form.setFieldsValue({
      name: productDetails.name,
      description: productDetails.description,
      cost: productDetails.cost,
      sale: productDetails.sell,
      newArrival: productDetails.newArrival,
      preOrder: productDetails.preOrder,
      orderQuantityLimit: productDetails.orderQuantityLimit,
    })
    setNewArrival(productDetails.newArrival)
    setPreOrder(productDetails.preOrder)

    const priceLevel = Object.entries(productDetails.priceLevels || {}).map(
      ([key, value]) => ({ category: key, value }),
    )
    form.setFieldValue('priceLevel', priceLevel)

    const images =
      productDetails.imageUrls?.map((item, idx) => ({
        uid: idx,
        name: `image-${idx}`,
        status: 'done',
        url: item,
      })) || []
    setFileList(images)
  }, [productDetails])

  const onFinish = (fieldsValue) => {
    const formData = new FormData()
    const urls = fileList.filter((f) => f.url).map((f) => f.url)

    fileList.forEach((f) => {
      if (f.originFileObj) formData.append('images', f.originFileObj)
    })

    formData.append('imageUrls', JSON.stringify(urls))
    formData.append(
      'subCategoryId',
      productDetails ? subCategoryId : fieldsValue?.subCategory,
    )
    formData.append(
      'categoryId',
      productDetails ? categoryId : fieldsValue?.category,
    )
    formData.append('name', fieldsValue?.name)
    formData.append('description', fieldsValue?.description)
    formData.append('cost', fieldsValue?.cost)
    formData.append('sell', fieldsValue?.sale)
    formData.append('newArrival', newArrival)
    formData.append('preOrder', preOrder)
    formData.append('priceLevels', dataMod(fieldsValue?.priceLevel))
    if (fieldsValue?.orderQuantityLimit)
      formData.append('orderQuantityLimit', fieldsValue?.orderQuantityLimit)
    if (fieldsValue?.filters)
      formData.append('filterValues', dataModFilters(fieldsValue?.filters))
    if (productDetails && !disabled) formData.append('id', productDetails.id)

    submitProduct({ formData, setDisabled })
  }

  return (
    <div className='p-4'>
      {!productDetails && (
        <div>
          <Title level={4} className='!mb-2'>
            {productDetails ? 'Edit Product Details' : 'Add New Product'}
          </Title>
          <Text type='secondary' className='!mb-4 block'>
            Fill or edit all the details of your product below
          </Text>
          <Divider />
        </div>
      )}

      <Card className='rounded-xl shadow-sm bg-white p-4 mb-6'>
        <Form
          form={form}
          layout='vertical'
          disabled={disabled}
          onFinish={onFinish}
          scrollToFirstError>
          {!productDetails && (
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label='Category'
                  name='category'
                  rules={[{ required: true, message: 'Select category' }]}>
                  <Select
                    placeholder='Select Category'
                    options={CATEGORIES}
                    onSelect={getCategory}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label='Sub-Category'
                  name='subCategory'
                  rules={[{ required: true, message: 'Select sub-category' }]}>
                  <Select
                    placeholder='Select Sub-Category'
                    options={subCategoryOptions}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label='Product Name'
                name='name'
                rules={[{ required: true, message: 'Enter product name' }]}>
                <Input placeholder='Product name' />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label='Description'
                name='description'
                tooltip='Brief summary of product'>
                <TextArea rows={3} placeholder='Description' />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label='Cost Price'
                name='cost'
                rules={[{ required: true }]}>
                <InputNumber
                  addonBefore='$'
                  min={0}
                  style={{ width: '100%' }}
                  placeholder='Enter cost'
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label='Sale Price'
                name='sale'
                rules={[{ required: true }]}>
                <InputNumber
                  addonBefore='$'
                  min={0}
                  style={{ width: '100%' }}
                  placeholder='Enter sale price'
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label='Quantity Limit' name='orderQuantityLimit'>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation='left'>Price Levels</Divider>
          <Form.List name='priceLevel'>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...rest }) => (
                  <Space
                    key={key}
                    align='baseline'
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                    }}>
                    <Form.Item
                      {...rest}
                      name={[name, 'category']}
                      rules={[{ required: true, message: 'Select tier' }]}>
                      <Select
                        placeholder='Tier'
                        options={PRICE_CATEGORY_OPTIONS}
                        style={{ width: 120 }}
                      />
                    </Form.Item>
                    <Form.Item
                      {...rest}
                      name={[name, 'value']}
                      rules={[{ required: true, message: 'Enter value' }]}>
                      <InputNumber
                        addonBefore='$'
                        style={{ width: 200 }}
                        placeholder='Price'
                      />
                    </Form.Item>
                    {!disabled && (
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    )}
                  </Space>
                ))}
                {!disabled && (
                  <Button
                    type='dashed'
                    onClick={() => add()}
                    icon={<PlusOutlined />}>
                    Add Price Tier
                  </Button>
                )}
              </>
            )}
          </Form.List>

          <Divider />
          <Space size='large'>
            <Checkbox
              checked={newArrival}
              onChange={(e) => setNewArrival(e.target.checked)}>
              New Arrival
            </Checkbox>
            <Checkbox
              checked={preOrder}
              onChange={(e) => setPreOrder(e.target.checked)}>
              Pre-Order
            </Checkbox>
          </Space>

          <Divider orientation='left'>Images</Divider>
          <Upload
            listType='picture-card'
            customRequest={dummyRequest}
            fileList={fileList}
            onChange={handleChange}
            multiple
            maxCount={10}>
            {fileList?.length >= 10 ? null : (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>

          <Divider orientation='left'>Filters</Divider>
          <Form.List name='filters'>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...rest }) => (
                  <Space
                    key={key}
                    align='baseline'
                    style={{ display: 'flex', marginBottom: 8 }}>
                    <Form.Item
                      {...rest}
                      name={[name, 'category']}
                      rules={[
                        { required: true, message: 'Select filter category' },
                      ]}>
                      <Select
                        placeholder='Category'
                        options={filters?.categories}
                        style={{ width: 150 }}
                      />
                    </Form.Item>
                    <Form.Item
                      {...rest}
                      name={[name, 'value']}
                      rules={[
                        { required: true, message: 'Select filter value' },
                      ]}>
                      <Input placeholder='Value' style={{ width: 200 }} />
                    </Form.Item>
                    {!disabled && (
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    )}
                  </Space>
                ))}
                {!disabled && (
                  <Button
                    type='dashed'
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}>
                    Add Filter
                  </Button>
                )}
              </>
            )}
          </Form.List>

          {!disabled && (
            <Form.Item className='!mt-6'>
              <Button
                type='primary'
                htmlType='submit'
                loading={loading}
                disabled={loading}>
                Submit
              </Button>
            </Form.Item>
          )}
        </Form>
      </Card>
    </div>
  )
}

export default AddProductForm
