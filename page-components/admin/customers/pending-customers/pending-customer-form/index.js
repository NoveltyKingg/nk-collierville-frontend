import React, { useEffect, useMemo, useState } from 'react'
import {
  Card,
  Input,
  Form,
  Upload,
  Button,
  Select,
  DatePicker,
  Typography,
  Divider,
  message,
  Space,
  Tag,
  Timeline,
  Image,
} from 'antd'
import {
  UploadOutlined,
  InboxOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  StopOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import useGetAdminApproval from '../../../hooks/useGetAdminApproval'
import dayjs from 'dayjs'

const { TextArea } = Input
const { Text } = Typography

const TIER_OPTIONS = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
  { label: 'D', value: 'D' },
]

// --- helpers ---
const toUploadFileList = (urls = []) =>
  (urls || []).map((u, i) => ({
    uid: `doc-${i}`,
    name: `document-${i + 1}`,
    status: 'done',
    url: u,
  }))

export default function PendingCustomerForm({ customer }) {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState([])

  const { getAdminApproval, loading: submitting } = useGetAdminApproval({
    storeId: customer?.storeId,
  })

  // Pre-fill form on mount / customer change
  useEffect(() => {
    if (!customer) return
    const docs = toUploadFileList(customer?.documentUrls)
    setFileList(docs)
    form.setFieldsValue({
      firstName: customer?.firstName,
      lastName: customer?.lastName,
      emailAddress: customer?.email,
      mobileNumber: customer?.phone,
      storeName: customer?.storeName,
      storeAddress1: customer?.address1,
      storeAddress2: customer?.address2,
      zipCode: customer?.zipCode,
      country: customer?.country,
      state: customer?.state,
      city: customer?.city,
      taxId: customer?.taxId,
      tier: customer?.tier,
      permitId: customer?.permitId,
      expiryDate: customer?.expiryDate ? dayjs(customer.expiryDate) : null,
      documents: docs,
      previousComments: customer?.comments,
    })
  }, [customer, form])

  const validateMessages = { required: '${label} is required!' }

  const buildPayload = (status) => {
    const values = form.getFieldsValue(true)
    // Convert dayjs -> ISO if present
    const expiryDateISO = values.expiryDate
      ? dayjs(values.expiryDate).toISOString()
      : undefined

    return {
      comment: values.comments,
      taxId: values.taxId,
      permitId: values.permitId,
      expiryDate: expiryDateISO,
      tier: values.tier,
      status,
    }
  }

  const onApprove = async () => {
    try {
      await form.validateFields([
        'taxId',
        'tier',
        'permitId',
        'expiryDate',
        'comments',
      ])
      const payload = buildPayload('APPROVED')
      getAdminApproval({ formData: payload })
    } catch {
      message.error('Please fix form errors before approving.')
    }
  }

  const onRequestChanges = async () => {
    try {
      await form.validateFields(['comments'])
      const payload = buildPayload('ON_HOLD')
      getAdminApproval({ formData: payload })
    } catch {
      message.error('Please add comments for the request.')
    }
  }

  const onReject = async () => {
    try {
      await form.validateFields(['comments'])
      const payload = buildPayload('REJECTED')
      getAdminApproval({ formData: payload })
    } catch {
      message.error('Please add a rejection comment.')
    }
  }

  const previousComments = useMemo(() => customer?.comments || [], [customer])

  // --- UI ---
  return (
    <div className='space-y-4'>
      {/* Summary header */}
      <Card bordered={false} className='rounded-xl shadow-sm'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <div className='text-slate-500 text-xs'>Store</div>
            <div className='text-base font-medium'>
              {customer?.storeName || '—'}
            </div>
            <div className='text-xs text-slate-500'>
              {customer?.email || 'No email'}
              {customer?.city
                ? ` • ${customer.city}${
                    customer?.state ? `, ${customer.state}` : ''
                  }`
                : ''}
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Tag color='processing'>Pending Approval</Tag>
            {customer?.tier ? (
              <Tag color='blue'>Tier {customer.tier}</Tag>
            ) : (
              <Tag>Tier —</Tag>
            )}
          </div>
        </div>
      </Card>

      {/* Main form */}
      <Card bordered={false} className='rounded-xl shadow-sm'>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          colon={false}
          layout='horizontal'
          validateMessages={validateMessages}
          disabled={submitting}>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
            <div>
              <Divider orientation='left'>Contact</Divider>
              <Form.Item label='First Name' name='firstName'>
                <Input disabled />
              </Form.Item>
              <Form.Item label='Last Name' name='lastName'>
                <Input disabled />
              </Form.Item>
              <Form.Item label='Email Address' name='emailAddress'>
                <Input disabled />
              </Form.Item>
              <Form.Item label='Mobile Number' name='mobileNumber'>
                <Input disabled />
              </Form.Item>

              <Divider orientation='left'>Store</Divider>
              <Form.Item label='Store Name' name='storeName'>
                <Input disabled />
              </Form.Item>
              <Form.Item label='Store Address 1' name='storeAddress1'>
                <Input disabled />
              </Form.Item>
              <Form.Item label='Store Address 2' name='storeAddress2'>
                <Input disabled />
              </Form.Item>
              <Form.Item label='Country' name='country'>
                <Input disabled />
              </Form.Item>
              <Form.Item label='State' name='state'>
                <Input disabled />
              </Form.Item>
              <Form.Item label='City' name='city'>
                <Input disabled />
              </Form.Item>
              <Form.Item label='Zip Code' name='zipCode'>
                <Input disabled />
              </Form.Item>
            </div>

            <div>
              <Divider orientation='left'>Compliance</Divider>
              <Form.Item
                label='Tax ID'
                name='taxId'
                rules={[{ required: true }]}>
                <Input placeholder='Enter Tax ID' />
              </Form.Item>
              <Form.Item label='Tier' name='tier' rules={[{ required: true }]}>
                <Select
                  placeholder='Select Tier'
                  options={TIER_OPTIONS}
                  style={{ width: 200 }}
                />
              </Form.Item>
              <Form.Item
                label='Permit ID'
                name='permitId'
                rules={[{ required: true }]}>
                <Input placeholder='Enter Permit ID' />
              </Form.Item>
              <Form.Item
                label='Expiry Date'
                name='expiryDate'
                rules={[{ required: true }]}>
                <DatePicker style={{ width: 200 }} />
              </Form.Item>

              <Divider orientation='left'>Documents</Divider>
              <Form.Item label='Documents' name='documents'>
                <Upload
                  multiple
                  accept='.jpg,.pdf,.png,.jpeg'
                  fileList={fileList}
                  listType='picture-card'
                  onChange={({ fileList: fl }) => setFileList(fl)}
                  onPreview={(file) => {
                    const url =
                      file.url ||
                      (file.originFileObj &&
                        URL.createObjectURL(file.originFileObj))
                    if (url) window.open(url, '_blank')
                  }}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
                {!!fileList?.length && (
                  <Image.PreviewGroup>
                    <div className='grid grid-cols-2 gap-3'>
                      {fileList
                        .filter((f) => f.url)
                        .map((f) => (
                          <Image
                            key={f.uid}
                            src={f.url}
                            alt={f.name}
                            className='rounded-md'
                          />
                        ))}
                    </div>
                  </Image.PreviewGroup>
                )}
              </Form.Item>

              <Divider orientation='left'>Comments</Divider>
              <Form.Item label='Previous Comments' name='previousComments'>
                {previousComments?.length ? (
                  <Timeline
                    items={previousComments.map((c, i) => ({
                      color: 'blue',
                      children: <div className='text-sm'>{c}</div>,
                      label: (
                        <span className='text-xs text-slate-500'>#{i + 1}</span>
                      ),
                    }))}
                  />
                ) : (
                  <Text type='secondary'>No previous comments</Text>
                )}
              </Form.Item>

              <Form.Item
                label='Comments'
                name='comments'
                rules={[{ required: true, message: 'Please add a comment' }]}>
                <TextArea
                  placeholder='Add reviewer comments or reasons…'
                  rows={4}
                />
              </Form.Item>
            </div>
          </div>
        </Form>

        {/* Sticky action bar */}
        <Divider />
        <div className='sticky bottom-0 bg-white py-2'>
          <Space wrap>
            <Button
              danger
              type='text'
              icon={<StopOutlined />}
              onClick={onReject}
              loading={submitting}>
              Deny
            </Button>
            <Button
              icon={<InfoCircleOutlined />}
              onClick={onRequestChanges}
              loading={submitting}>
              Request Info/Changes
            </Button>
            <Button
              type='primary'
              icon={<CheckCircleOutlined />}
              onClick={onApprove}
              loading={submitting}>
              Approve
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  )
}
