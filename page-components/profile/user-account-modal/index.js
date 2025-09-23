import React from 'react'
import { Modal, Form, Input, Button } from 'antd'
import useCreateUser from '../hooks/useCreateUser'
import useGetContext from '@/common/context/useGetContext'

function UserAccountModal({ openUserAccountModal, setOpenUserAccountModal }) {
  const [form] = Form.useForm()
  const { noveltyData } = useGetContext()
  const { profile } = noveltyData || {}

  const { createUser, loading } = useCreateUser()

  const validateMessages = {
    required: '${label} is required!',
  }

  const handleClose = () => {
    setOpenUserAccountModal(!openUserAccountModal)
  }

  const onFinish = (val) => {
    createUser({ formValues: val, storeId: profile?.storeId })
  }

  return (
    <Modal
      open={openUserAccountModal}
      onCancel={handleClose}
      footer={null}
      title='Add User For This Store'>
      <Form
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout='horizontal'
        form={form}
        validateMessages={validateMessages}
        onFinish={onFinish}
        scrollToFirstError
        style={{
          maxWidth: '100%',
        }}>
        <Form.Item
          name='firstName'
          label='First Name'
          className='!mb-2'
          rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name='lastName'
          label='Last Name'
          className='!mb-2'
          rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name='email'
          label='Email'
          rules={[{ required: true }]}
          className='!mb-2'>
          <Input />
        </Form.Item>
        <Form.Item
          name='password'
          label='Password'
          className='!mb-2'
          rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item name='mobileNumber' label='Mobile Number' className='!mb-2'>
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 22 }}>
          <div className='flex justify-end gap-4'>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UserAccountModal
