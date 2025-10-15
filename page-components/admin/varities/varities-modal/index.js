import React, { useEffect, useState } from 'react'
import {
  Modal,
  Button,
  Input,
  Upload,
  InputNumber,
  Form,
  Typography,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import useSubmitVarities from '../../hooks/useSubmitVarities'
import { dummyRequest } from '@/utils/dummyRequest'

const { TextArea } = Input
const { Title } = Typography

function VaritiesModal({
  open,
  setOpen,
  handleOpen,
  product,
  editData,
  edit,
  setEdit,
  setVaritiesList,
}) {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState([])
  const { submitVariety, loading } = useSubmitVarities({
    product,
    setVaritiesList,
    setOpen,
  })

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList)

  const handleCancel = () => {
    handleOpen()
    setEdit(false)
    form.resetFields()
    setFileList([])
  }

  useEffect(() => {
    if (editData && edit) {
      form.setFieldsValue({
        name: editData?.name,
        stock: editData?.stock,
        barcodes: editData?.barcodes.join('\n'),
      })
      const images = [
        {
          uid: '1',
          name: 'image-1',
          status: 'done',
          url: editData?.imageUrls,
        },
      ]
      setFileList(images)
      form.setFieldValue('images', images)
    }
  }, [editData, edit, form])

  const onFinish = (val) => {
    const barcodes = val?.barcodes?.split('\n') || []
    const formData = new FormData()
    formData.append('name', val?.name)
    formData.append('stock', val?.stock)
    formData.append('barcodes', barcodes)
    if (val?.images?.[0]?.url) {
      formData.append('imageUrl', val?.images[0]?.url)
    } else if (val?.images?.fileList?.[0]?.originFileObj) {
      formData.append('image', val.images.fileList[0].originFileObj)
    }
    if (editData && edit) {
      formData.append('id', editData?.key)
    }
    submitVariety({ formData })
  }

  return (
    <Modal
      open={open}
      title={
        <Title level={4}>{edit ? 'Edit Variety' : 'Add New Variety'}</Title>
      }
      onCancel={handleCancel}
      width={520}
      footer={null}>
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        initialValues={{ stock: 0 }}>
        <Form.Item label='Name' name='name' rules={[{ required: true }]}>
          <Input placeholder='Enter variety name' />
        </Form.Item>
        <Form.Item label='Stock' name='stock' rules={[{ required: true }]}>
          <InputNumber
            min={0}
            className='w-full'
            onWheel={(e) => e.currentTarget.blur()}
          />
        </Form.Item>
        <Form.Item label='Barcodes' name='barcodes'>
          <TextArea rows={3} placeholder='Enter one barcode per line' />
        </Form.Item>
        <Form.Item label='Images' name='images' rules={[{ required: true }]}>
          <Upload
            listType='picture-card'
            customRequest={dummyRequest}
            fileList={fileList}
            onChange={handleChange}
            maxCount={1}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <div className='flex justify-end gap-2'>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type='primary' htmlType='submit' loading={loading}>
            {edit ? 'Update' : 'Submit'}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default VaritiesModal
