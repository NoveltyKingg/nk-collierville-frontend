import React, { useState } from 'react'
import { Button, Form, Input, Select } from 'antd'
import useGetCountries from '@/utils/useGetCountries'
import useGetStateByCountry from '@/utils/useGetStateByCountry'
import useGetCitiesByState from '@/utils/useGetCitiesByState'

export default function AddAddress({
  setDeliveryAddress,
  setAddAddress,
  deliveryAddress,
  setValue,
}) {
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
    const next = [...deliveryAddress, val]
    setDeliveryAddress(next)
    setValue(next.length - 1)
    form.resetFields()
    setAddAddress(false)
  }

  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={onFinish}
      requiredMark={false}
      validateMessages={{ required: '${label} is required!' }}>
      <Form.Item
        label='Street Address'
        name='address1'
        rules={[{ required: true }]}>
        <Input placeholder='Street Address' />
      </Form.Item>

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
        <Form.Item label='Apt Number' name='apartment'>
          <Input placeholder='APT Number' />
        </Form.Item>
        <Form.Item label='Country' name='country' rules={[{ required: true }]}>
          <Select
            placeholder='Select Country'
            options={countriesData?.map((c) => ({
              label: c?.name,
              value: c?.name,
            }))}
            showSearch
            onSelect={handleSelectCountry}
          />
        </Form.Item>
        <Form.Item label='Zip Code' name='zipcode' rules={[{ required: true }]}>
          <Input placeholder='Zip Code' />
        </Form.Item>
      </div>

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <Form.Item label='State' name='state' rules={[{ required: true }]}>
          <Select
            placeholder='Select State'
            options={statesData?.map((s) => ({
              label: s?.name,
              value: s?.name,
            }))}
            showSearch
            onSelect={handleSelectState}
          />
        </Form.Item>
        <Form.Item label='City' name='city' rules={[{ required: true }]}>
          <Select
            placeholder='Select City'
            options={citiesData?.map((ct) => ({ label: ct, value: ct }))}
            showSearch
          />
        </Form.Item>
      </div>

      <div className='mt-2 flex items-center justify-end gap-2'>
        <Button type='text' onClick={() => setAddAddress(false)}>
          Cancel
        </Button>
        <Button htmlType='submit'>Use This Address</Button>
      </div>
    </Form>
  )
}
