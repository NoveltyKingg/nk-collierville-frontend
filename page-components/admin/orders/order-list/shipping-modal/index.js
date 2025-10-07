import { UploadOutlined } from '@ant-design/icons'
import {
  Button,
  Input,
  InputNumber,
  Modal,
  Upload,
  message,
  Space,
  Typography,
  Divider,
} from 'antd'
import React, { useState } from 'react'
import useUpdateShipmentDetails from '@/page-components/admin/hooks/useUpdateShipmentDetails'

const { Text } = Typography

function ShippingModal({
  openShippingModal,
  handleShippingModalChange,
  updateOrderStatus,
}) {
  const [trackingNumber, setTrackingNumber] = useState()
  const [totalAmount, setTotalAmount] = useState()
  const [invoice, setInvoice] = useState([])

  const dummyRequest = ({ file, onSuccess }) =>
    setTimeout(() => onSuccess('ok'), 0)

  const { updateShipmentDetails, loading } = useUpdateShipmentDetails({
    orderId: openShippingModal?.orderId,
  })

  const handleUpdateShipment = () => {
    if (!trackingNumber) {
      message.error('Please add a tracking number')
      return
    }
    const formData = new FormData()
    formData.append('orderId', openShippingModal?.orderId)
    formData.append('tracking', trackingNumber)
    if (totalAmount != null) formData.append('totalAmount', totalAmount)
    invoice?.forEach(
      (f) => f?.originFileObj && formData.append('invoice', f.originFileObj),
    )
    updateShipmentDetails({ formData, updateOrderStatus })
  }

  const handleInvoice = ({ fileList: newFileList }) => setInvoice(newFileList)

  const props = {
    beforeUpload: (file) => {
      const ok =
        file.type === 'image/png' ||
        file.type === 'application/pdf' ||
        file.type === 'image/jpeg'
      if (!ok) message.error(`${file.name} is not a PNG/JPG/PDF`)
      return ok || Upload.LIST_IGNORE
    },
  }

  return (
    <Modal
      open={!!openShippingModal}
      footer={null}
      title={`Shipment Details — Order ${openShippingModal?.orderId ?? ''}`}
      onCancel={handleShippingModalChange}
      destroyOnClose>
      <div className='space-y-3'>
        <div>
          <Text type='secondary'>Tracking Number</Text>
          <Input
            placeholder='Tracking Number'
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
        </div>

        <div>
          <Text type='secondary'>Total Amount (optional)</Text>
          <InputNumber
            placeholder='Total Amount'
            style={{ width: '100%' }}
            onChange={(v) => setTotalAmount(v)}
            min={0}
          />
        </div>

        <div>
          <Text type='secondary'>Invoice (PNG/JPG/PDF)</Text>
          <Upload
            {...props}
            customRequest={dummyRequest}
            listType='picture'
            fileList={invoice}
            maxCount={1}
            onChange={handleInvoice}
            multiple={false}>
            <Button icon={<UploadOutlined />}>Upload Invoice</Button>
          </Upload>
        </div>

        <Divider className='!my-2' />
        <div className='flex justify-end'>
          <Space>
            <Button onClick={handleShippingModalChange}>Cancel</Button>
            <Button
              type='primary'
              onClick={handleUpdateShipment}
              loading={loading}>
              Submit
            </Button>
          </Space>
        </div>
      </div>
    </Modal>
  )
}

export default ShippingModal
