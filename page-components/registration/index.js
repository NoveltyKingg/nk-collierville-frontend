import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Image, Select, Flex, Upload, App } from 'antd'
import CustomisedRequiredFormMark from '@/utils/customised-required-form-mark'
import useSubmitRegistration from './hooks/useSubmitRegistration'
import { UploadOutlined } from '@ant-design/icons'
import { FormatRegistrationData } from '@/utils/format-registration-data'
import useGetStateByCountry from './hooks/useGetStatesByCountry'
import useGetCitiesByState from './hooks/useGetCitiesByState'
import useGetCountries from './hooks/useGetCountries'
import useIsMobile from '@/utils/useIsMobile'
import useAddNewStore from './hooks/useAddNewStore'
import useGetContext from '@/common/context/useGetContext'

const Registration = ({ isAddNewStore = false, handleClose }) => {
  const [form] = Form.useForm()
  const [country, setCountry] = useState('United States')
  const { message } = App.useApp()

  const { countriesData } = useGetCountries()
  const { noveltyData } = useGetContext()

  const email = noveltyData?.profile?.email || sessionStorage.getItem('email')
  const { getStatesByCountry, statesData } = useGetStateByCountry()
  const { getCitiesByState, citiesData } = useGetCitiesByState()
  const { addNewStore, newStoreLoading } = useAddNewStore()

  const { submitRegistration, loading } = useSubmitRegistration()

  const handleSelectCountry = (val) => {
    getStatesByCountry({ country: 'United States' })
    setCountry(val)
  }

  const handleSelectState = (val) => {
    getCitiesByState({ country, state: val })
  }

  const { isMobile } = useIsMobile()

  const onFinish = (val) => {
    const formattedData = FormatRegistrationData(val, isAddNewStore)
    if (isAddNewStore) {
      addNewStore({
        formData: formattedData,
        userId: noveltyData?.profile?.userId,
        handleClose,
      })
    } else {
      submitRegistration({ formattedData })
    }
  }

  const validateMessages = {
    required: '${label} is required!',
  }

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }

  const handleTaxId = ({ fileList: newFileList }) =>
    form.setFieldValue('taxId', newFileList)

  const handleResidenceProof = ({ fileList: newFileList }) =>
    form.setFieldValue('drivingLicense', newFileList)

  const handleTobaccoLicense = ({ fileList: newFileList }) =>
    form.setFieldValue('tobaccoLicense', newFileList)

  const props = {
    beforeUpload: (file) => {
      const isPNG =
        file.type === 'image/png' ||
        file.type === 'application/pdf' ||
        file.type === 'image/jpeg'
      if (!isPNG) {
        message.error(`${file.name} is not a png/pdf file`)
      }
      return isPNG || Upload.LIST_IGNORE
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
  }

  useEffect(() => {
    form.setFieldValue('country', country)
    form.setFieldValue('email', email)
    getStatesByCountry({ country: 'United States' })
  }, [])

  return (
    <div className='w-full flex flex-col gap-2'>
      {!isAddNewStore && (
        <Image
          src='https://i.ibb.co/1Gv63CD3/Chat-GPT-Image-Jul-22-2025-01-43-27-PM.png'
          height={200}
          radius='none'
          width={'100%'}
          preview={false}
          alt='Loading...'
        />
      )}
      <div className='px-4'>
        Welcome to Novelty King Collierville, Please proceed to fill the
        details.
      </div>
      <Form
        form={form}
        className='!p-4'
        requiredMark={CustomisedRequiredFormMark}
        initialValues={{
          requiredMarkValue: 'customize',
        }}
        onFinish={onFinish}
        validateMessages={validateMessages}>
        {!isAddNewStore && (
          <Flex vertical gap={8}>
            <h1 className='font-bold text-[16px]'>PERSONAL DETAILS</h1>
            <Flex vertical gap={12}>
              <Flex gap={20}>
                <Form.Item
                  name='firstName'
                  label='First Name'
                  rules={[{ required: !isAddNewStore }]}
                  style={{ width: '100%' }}>
                  <Input placeholder='Enter your first name' type='text' />
                </Form.Item>
                <Form.Item
                  name='lastName'
                  label='Last Name'
                  rules={[{ required: !isAddNewStore }]}
                  style={{ width: '100%' }}>
                  <Input placeholder='Enter your last name' type='text' />
                </Form.Item>
              </Flex>
              <Form.Item
                name='email'
                label='Email'
                rules={[{ required: !isAddNewStore }]}>
                <Input readOnly placeholder='Enter your Email' type='text' />
              </Form.Item>
              <Form.Item
                name='mobileNumber'
                label='Mobile Number'
                rules={[{ required: !isAddNewStore }]}>
                <Input placeholder='Enter your mobile number' type='text' />
              </Form.Item>
            </Flex>
          </Flex>
        )}
        <div className='flex flex-col'>
          <div className='font-bold text-[16px]'>STORE DETAILS</div>
          <Flex vertical gap={8}>
            <Form.Item
              name='storeName'
              label='Store Name'
              rules={[{ required: true }]}>
              <Input placeholder='Enter your store name' type='text' />
            </Form.Item>
            <Flex gap={20} vertical={isMobile}>
              <Form.Item
                label='Store Address 1'
                name='storeAddress1'
                rules={[{ required: true }]}
                style={{ width: '100%' }}>
                <Input placeholder='Enter your store address1' type='text' />
              </Form.Item>
              <Form.Item
                label='Store Address 2'
                name='storeAddress2'
                style={{ width: '100%' }}>
                <Input placeholder='Enter your store address2' type='text' />
              </Form.Item>
            </Flex>
            <Flex gap={20}>
              <Form.Item
                label='Country'
                name='country'
                rules={[{ required: true }]}
                style={{ width: '100%' }}>
                <Select
                  placeholder='Select your Country'
                  type='text'
                  showSearch
                  options={countriesData?.map((item) => ({
                    label: item?.name,
                    value: item?.name,
                  }))}
                  disabled
                  onSelect={handleSelectCountry}
                />
              </Form.Item>
              <Form.Item
                label='State'
                name='state'
                style={{ width: '100%' }}
                rules={[{ required: true }]}>
                <Select
                  placeholder='Select your State'
                  type='text'
                  onSelect={handleSelectState}
                  options={statesData?.map((item) => ({
                    label: item?.name,
                    value: item?.name,
                  }))}
                  showSearch
                />
              </Form.Item>
            </Flex>
            <Flex gap={20}>
              <Form.Item
                label='City'
                name='city'
                style={{ width: '100%' }}
                rules={[{ required: true }]}>
                <Select
                  placeholder='Select your City'
                  type='text'
                  options={citiesData?.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                  showSearch
                />
              </Form.Item>
              <Form.Item
                label='Zip Code'
                name='zipCode'
                rules={[{ required: true }]}
                style={{ width: '100%' }}>
                <Input placeholder='Enter your zipcode' type='text' />
              </Form.Item>
            </Flex>
            <Form.Item label='Store Email' name='storeEmail'>
              <Input placeholder='Enter your store email' type='text' />
            </Form.Item>
            <Form.Item label='Store Mobile Number' name='storeMobile'>
              <Input placeholder='Enter your store mobile number' type='text' />
            </Form.Item>
          </Flex>
        </div>
        <Flex vertical gap={8}>
          <div className='font-bold text-[16px]'>ATTACH DOCUMENTS</div>
          <div>
            <Form.Item label='Tax ID' name='taxId' rules={[{ required: true }]}>
              <Upload
                {...props}
                customRequest={dummyRequest}
                multiple={false}
                onChange={handleTaxId}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              label='Driving License / Other proof'
              name='drivingLicense'
              rules={[{ required: true }]}>
              <Upload
                {...props}
                multiple={false}
                customRequest={dummyRequest}
                onChange={handleResidenceProof}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item label='Tobacco ID' name='tobaccoId'>
              <Upload
                {...props}
                multiple={false}
                customRequest={dummyRequest}
                onChange={handleTobaccoLicense}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </div>
        </Flex>
        <Form.Item>
          <Button
            htmlType='submit'
            color='primary'
            variant='solid'
            loading={loading || newStoreLoading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Registration
