import React, { useMemo } from 'react'
import { Button, Form, Input, Select, message } from 'antd'
import useSendQueryEmail from '../hooks/useSendQueryEmail'

const QUERY_TYPE_OPTIONS = [
  { label: 'Payment Related', value: 'Payment Related' },
  { label: 'Want to place an Order', value: 'Want to place an Order' },
  { label: 'Complaints', value: 'Complaints' },
  { label: 'Website Technical Issues', value: 'Website Technical Issues' },
  { label: 'Others', value: 'Others' },
]

function MessageForm() {
  const [form] = Form.useForm()
  const { sendQueryEmail, loading } = useSendQueryEmail()

  const validateMessages = useMemo(
    () => ({
      required: '${label} is required!',
      types: {
        email: 'Please enter a valid email',
      },
      string: {
        min: '${label} must be at least ${min} characters',
      },
      pattern: {
        mismatch: 'Please enter a valid value',
      },
    }),
    [],
  )

  const onFinish = async (fieldsValue) => {
    try {
      await sendQueryEmail({ fieldsValue })
      message.success('Thanks! Your message was sent.')
      form.resetFields()
    } catch (e) {
      message.error(
        e?.message || 'Failed to send the message. Please try again.',
      )
    }
  }

  // simple phone regex; keep your backend validation as source of truth
  const PHONE_REGEX = /^\+?[0-9\s\-().]{7,20}$/

  return (
    <Form
      layout='vertical'
      form={form}
      onFinish={onFinish}
      validateMessages={validateMessages}
      requiredMark='optional'
      colon={false}
      style={{ maxWidth: 720 }}>
      <Form.Item
        label='Query Type'
        name='query_type'
        rules={[{ required: true, message: 'Please select a query type' }]}>
        <Select
          placeholder='Select a type'
          options={QUERY_TYPE_OPTIONS}
          allowClear
        />
      </Form.Item>

      <Form.Item
        label='Full Name'
        name='full_name'
        rules={[{ required: true }, { min: 2 }]}>
        <Input placeholder='John Doe' autoComplete='name' />
      </Form.Item>

      <Form.Item
        label='Store Name'
        name='store_name'
        rules={[{ required: true }]}>
        <Input placeholder='Your Store LLC' />
      </Form.Item>

      <Form.Item
        label='Email Address'
        name='email_address'
        rules={[{ required: true }, { type: 'email' }]}>
        <Input placeholder='you@example.com' autoComplete='email' />
      </Form.Item>

      <Form.Item
        label='Mobile Number'
        name='mobile_number'
        rules={[{ required: true }, { pattern: PHONE_REGEX }]}>
        <Input placeholder='+1 901 555 1234' inputMode='tel' />
      </Form.Item>

      <Form.Item
        label='Issue Description'
        name='issue_description'
        rules={[{ required: true }, { min: 10 }]}
        extra='Please include order number or product details if applicable.'>
        <Input.TextArea
          placeholder='Tell us a bit about the issue…'
          showCount
          maxLength={1000}
          autoSize={{ minRows: 4, maxRows: 8 }}
        />
      </Form.Item>

      <Form.Item name='website' className='!hidden'>
        <Input tabIndex={-1} autoComplete='off' />
      </Form.Item>

      <Form.Item className='!mb-0'>
        <Button
          type='primary'
          htmlType='submit'
          loading={loading}
          disabled={loading}>
          Send Request
        </Button>
      </Form.Item>
    </Form>
  )
}

export default MessageForm
