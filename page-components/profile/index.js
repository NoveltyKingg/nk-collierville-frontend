import React, { useEffect, useState } from 'react'
import { Avatar, Button, Card, Form, Input, Upload } from 'antd'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { dummyRequest } from '@/utils/dummyRequest'
import useGetProfile from './hooks/useGetProfile'
import useGetContext from '@/common/context/useGetContext'
import { setFormValues } from './set-form-values'
import UserAccountModal from './user-account-modal'
import useUpdateProfile from './hooks/useUpdateProfile'
import RequestStatementModal from './request-statement-modal'
import useDeleteStore from './hooks/useDeleteStore'
import useIsMobile from '@/utils/useIsMobile'

const LabeledRow = ({ label, name, children }) => (
  <div className='flex flex-col gap-1 min-w-0'>
    <span className='text-[13px] text-neutral-500'>{label}</span>
    <Form.Item name={name} noStyle>
      {children}
    </Form.Item>
  </div>
)

function Profile() {
  const [fileList, setFileList] = useState([])
  const [personalDetails, setPersonalDetails] = useState({})
  const [openUserAccountModal, setOpenUserAccountModal] = useState(false)
  const [isEdit, setIsEdit] = useState()
  const [openRequestStatementModal, setOpenRequestStatementModal] =
    useState(false)
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList)

  const { noveltyData } = useGetContext()
  const { profile } = noveltyData || {}

  const { data, getProfile } = useGetProfile()
  const { updateProfile, loading } = useUpdateProfile({
    userId: profile?.userId,
  })

  const { isMobile } = useIsMobile()
  const { deleteStore, deleteStoreLoading } = useDeleteStore()

  const [form] = Form.useForm()

  const handleEdit = (name) => {
    setIsEdit(name)
  }

  console.log(profile, 'profileee')

  useEffect(() => {
    if (profile?.userId)
      getProfile({ setPersonalDetails, userId: profile?.userId })
  }, [profile?.userId])

  useEffect(() => {
    setFormValues(form, data, setFileList)
  }, [data])

  const handleDeleteStore = () => {
    deleteStore({ userId: profile?.userId, storeId: profile?.storeId })
  }

  const handleInput = (key, e) => {
    setPersonalDetails((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const validateMessages = { required: '${label} is required!' }

  const onFinish = () => {
    const formData = new FormData()
    const urls = []
    fileList.forEach((f) => f?.url && urls.push(f.url))
    fileList.forEach(
      (f) => f?.originFileObj && formData.append('images', f.originFileObj),
    )
    if (urls.length) formData.append('documentUrls', JSON.stringify(urls))
    formData.append('firstName', personalDetails?.first_name)
    formData.append('lastName', personalDetails?.last_name)
    formData.append('storeEmail', form.getFieldValue('storeEmail'))
    formData.append('storeId', profile?.storeId)
    formData.append(
      'storeMobileNumber',
      form.getFieldValue('storeMobileNumber'),
    )
    updateProfile({ formData })
  }

  useEffect(() => {
    setFormValues(form, data, setFileList)
  }, [data])

  const fullName = `${data?.firstName || ''} ${data?.lastName || ''}`.trim()
  const initials = (data?.firstName?.[0] || '') + (data?.lastName?.[0] || '')
  const roleLabel =
    profile?.role === 'PRIMARY_USER' ? 'ADMIN' : profile?.role || 'USER'
  const locationLine =
    data?.city && data?.country
      ? `${data.city}, ${data.country}`
      : data?.city || data?.country || '—'

  return (
    <div className='w-full flex flex-col gap-6  mx-auto px-3 md:px-6 py-4 md:py-6'>
      <div className='flex flex-col md:flex-row gap-2 md:justify-between items-center'>
        <h1 className='text-xl md:text-2xl font-semibold text-neutral-800 '>
          My Profile
        </h1>
        <div className='flex flex-col md:flex-row md:flex-wrap gap-3'>
          {profile?.role === 'PRIMARY_USER' && (
            <Button onClick={() => setOpenUserAccountModal(true)}>
              Add a User Account For This Store
            </Button>
          )}
          {profile?.role === 'PRIMARY_USER' && (
            <Button
              type='primary'
              onClick={() => setOpenRequestStatementModal(true)}>
              Request For Account statement
            </Button>
          )}
          {profile?.role === 'PRIMARY_USER' && (
            <Button
              danger
              onClick={handleDeleteStore}
              loading={deleteStoreLoading}>
              Delete this store account
            </Button>
          )}
        </div>
      </div>

      <Card className='rounded-2xl shadow-sm border border-neutral-200/50 bg-white mb-5'>
        <div className='flex items-start gap-4 md:gap-6'>
          <div className='relative'>
            <Avatar size={80} className='bg-neutral-100 text-neutral-800'>
              {initials || 'NA'}
            </Avatar>
          </div>
          <div className='flex flex-col gap-1 min-w-0'>
            <div className='text-lg md:text-xl font-medium text-neutral-900 truncate'>
              {fullName || '—'}
            </div>
            <div className='text-[13px] text-neutral-500'>{roleLabel}</div>
            <div className='text-[13px] text-neutral-500 uppercase'>
              {locationLine}
            </div>
          </div>
        </div>
      </Card>
      <Card
        className='rounded-2xl shadow-sm border border-neutral-200/50 bg-white mb-5'
        title={
          <span className='text-neutral-800 font-medium'>
            Personal Information
          </span>
        }
        extra={
          <Button
            type='default'
            icon={<EditOutlined />}
            onClick={() => handleEdit('personal')}>
            Edit
          </Button>
        }>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 uppercase'>
          <LabeledRow label='First Name'>
            <Input
              variant='underlined'
              className='p-0 h-auto text-[15px] uppercase'
              placeholder='First Name'
              value={personalDetails?.first_name}
              onChange={(e) => handleInput('first_name', e)}
              disabled={isEdit !== 'personal'}
            />
          </LabeledRow>
          <LabeledRow label='Last Name'>
            <Input
              variant='underlined'
              className='p-0 h-auto text-[15px] uppercase'
              placeholder='Last Name'
              value={personalDetails?.last_name}
              onChange={(e) => handleInput('last_name', e)}
              disabled={isEdit !== 'personal'}
            />
          </LabeledRow>
          <LabeledRow label='Date of Birth'>{data?.dob || '—'}</LabeledRow>
          <LabeledRow label='Email Address'>
            <Input
              variant='borderless'
              disabled
              className='p-0 h-auto text-[15px] uppercase'
              value={data?.email}
            />
          </LabeledRow>
          <LabeledRow label='Phone Number'>
            <Input
              variant='borderless'
              disabled
              className='p-0 h-auto text-[15px] uppercase'
              value={data?.phone}
            />
          </LabeledRow>
          <LabeledRow label='User Role'>{roleLabel}</LabeledRow>
        </div>
      </Card>
      <Card
        className='rounded-2xl shadow-sm border border-neutral-200/50 bg-white mb-5'
        title={
          <span className='text-neutral-800 font-medium'>Store Details</span>
        }
        extra={
          <Button
            type='default'
            icon={<EditOutlined />}
            onClick={() => handleEdit('store')}>
            Edit
          </Button>
        }>
        <Form
          form={form}
          layout='horizontal'
          validateMessages={validateMessages}
          onFinish={onFinish}
          className='mt-6 uppercase flex flex-col gap-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <LabeledRow label='Store Name' name='storeName'>
              <Input
                variant='underlined'
                className='p-0 h-auto text-[15px] uppercase'
                disabled
              />
            </LabeledRow>
            <LabeledRow label='Address 1' name='address1'>
              <Input
                variant='underlined'
                className='p-0 h-auto text-[15px] uppercase'
                disabled
              />
            </LabeledRow>
            <LabeledRow label='Address 2' name='address2'>
              <Input
                variant='underlined'
                className='p-0 h-auto text-[15px] uppercase'
                disabled
              />
            </LabeledRow>
            <LabeledRow label='Country' name='country'>
              <Input
                variant='underlined'
                className='p-0 h-auto text-[15px] uppercase'
                disabled
              />
            </LabeledRow>
            <LabeledRow label='State' name='state'>
              <Input
                variant='underlined'
                className='p-0 h-auto text-[15px] uppercase'
                disabled
              />
            </LabeledRow>
            <LabeledRow label='City' name='city'>
              <Input
                variant='underlined'
                className='p-0 h-auto text-[15px] uppercase'
                disabled
              />
            </LabeledRow>
            <LabeledRow label='Zip Code' name='zipCode'>
              <Input
                variant='underlined'
                className='p-0 h-auto text-[15px] uppercase'
                disabled
              />
            </LabeledRow>
            <LabeledRow label='Store Email' name='storeEmail'>
              <Input
                variant='underlined'
                className='p-0 h-auto text-[15px] uppercase'
                disabled={isEdit !== 'store'}
              />
            </LabeledRow>
            <LabeledRow label='Store Phone Number' name='storeMobileNumber'>
              <Input
                variant='underlined'
                className='p-0 h-auto text-[15px] uppercase'
                disabled={isEdit !== 'store'}
              />
            </LabeledRow>
          </div>
          {!isMobile && (
            <div className='flex flex-col gap-4'>
              <LabeledRow label='Documents' name='documents'>
                <Upload
                  listType='picture-card'
                  maxCount={10}
                  customRequest={dummyRequest}
                  multiple
                  showUploadList={{ showRemoveIcon: false }}
                  fileList={fileList}
                  onChange={handleChange}>
                  {fileList?.length >= 10 ? null : (
                    <Button
                      style={{ border: 0, background: 'none' }}
                      disabled={isEdit !== 'store'}
                      icon={<PlusOutlined />}>
                      <div>Upload</div>
                    </Button>
                  )}
                </Upload>
              </LabeledRow>
            </div>
          )}
          <Button
            type='primary'
            htmlType='submit'
            loading={loading}
            className='flex justify-end'
            disabled={loading}>
            Save Details
          </Button>
        </Form>
      </Card>

      {openUserAccountModal && (
        <UserAccountModal
          openUserAccountModal={openUserAccountModal}
          setOpenUserAccountModal={setOpenUserAccountModal}
        />
      )}
      {openRequestStatementModal && (
        <RequestStatementModal
          openRequestStatementModal={openRequestStatementModal}
          handleOpenStatementModal={() => setOpenRequestStatementModal(false)}
        />
      )}
    </div>
  )
}

export default Profile
