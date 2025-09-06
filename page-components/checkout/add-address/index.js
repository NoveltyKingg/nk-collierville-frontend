import React, { useState } from 'react'
import { Button, Form, Input, Select } from 'antd'
import useGetCountries from '@/utils/useGetCountries'
import useGetStateByCountry from '@/utils/useGetStateByCountry'
import useGetCitiesByState from '@/utils/useGetCitiesByState'

function AddAddress({ setDeliveryAddress, setAddAddress, deliveryAddress }) {
  const [form] = Form.useForm()

  const [country, setCountry] = useState()

  const { countriesData } = useGetCountries()
  const { getStatesByCountry, statesData } = useGetStateByCountry()
  const { getCitiesByState, citiesData } = useGetCitiesByState()

  const handleSelectCountry = (val) => {
    getStatesByCountry({ country: val })
    setCountry(val)
  }

  const handleSelectState = (val) => {
    getCitiesByState({ country, state: val })
  }

  const onFinish = (val) => {
    setDeliveryAddress([...deliveryAddress, val])
    form.resetFields()
    setAddAddress(false)
  }

  const handleCancel = () => {
    setAddAddress(false)
  }

  const validateMessages = {
    required: '${label} is required!',
  }

  return (
    <div>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 18,
        }}
        colon={false}
        layout='horizontal'
        form={form}
        validateMessages={validateMessages}
        onFinish={onFinish}
        scrollToFirstError>
        <Form.Item
          label='Address 1'
          name='address1'
          rules={[{ required: true }]}>
          <Input placeholder='Enter Address 1' />
        </Form.Item>
        <Form.Item label='Address 2' name='address2'>
          <Input placeholder='Enter Address 2' />
        </Form.Item>
        <Form.Item label='Country' name='country' rules={[{ required: true }]}>
          <Select
            placeholder='Select Country'
            showSearch
            options={countriesData.map((item) => ({
              label: item?.name,
              value: item?.name,
            }))}
            onSelect={handleSelectCountry}
          />
        </Form.Item>
        <Form.Item label='State' name='state' rules={[{ required: true }]}>
          <Select
            placeholder='Select State'
            options={statesData?.map((item) => ({
              label: item?.name,
              value: item?.name,
            }))}
            showSearch
            onSelect={handleSelectState}
          />
        </Form.Item>
        <Form.Item label='City' name='city' rules={[{ required: true }]}>
          <Select
            placeholder='Select City'
            options={citiesData?.map((item) => ({
              label: item,
              value: item,
            }))}
            showSearch
          />
        </Form.Item>
        <Form.Item label='Zip Code' name='zipcode' rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            span: 22,
          }}>
          <div>
            {' '}
            <Button type='text' onClick={handleCancel}>
              Cancel
            </Button>
            <Button htmlType='submit'>Add Address</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

export default AddAddress
