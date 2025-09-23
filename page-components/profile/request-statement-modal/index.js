import { Button, DatePicker, Input, Modal } from 'antd'
import React, { useState } from 'react'
import useRequestStatement from '../hooks/useRequestStatement'
import useGetContext from '@/common/context/useGetContext'

function RequestStatementModal({
  openRequestStatementModal,
  handleOpenStatementModal,
}) {
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()

  const onChange = (dateStr, setState) => {
    setState(dateStr)
  }

  const { noveltyData } = useGetContext()
  const { profile } = noveltyData || {}

  const { requestStatement, loading } = useRequestStatement({
    userId: profile?.userId,
    storeId: profile?.storeId,
  })

  const handleRequestStatement = () => {
    requestStatement({ startDate, endDate, handleOpenStatementModal })
  }

  const disabledDate = (date, type) => {
    const minDate = new Date('2019-01-01')
    const maxDate = new Date()
    if (type === 'min') {
      return date && date < minDate
    }
    if (type === 'max') {
      return date && date > maxDate
    }
  }

  return (
    <Modal
      open={openRequestStatementModal}
      footer={null}
      onCancel={handleOpenStatementModal}
      title='Request For Account Statement'>
      <div className='flex flex-col gap-4'>
        <div>
          Start Date:{' '}
          <DatePicker
            onChange={(_, dateStr) => onChange(dateStr, setStartDate)}
            disabledDate={(date) => disabledDate(date, 'min')}
          />
        </div>
        <div>
          End Date:{' '}
          <DatePicker
            onChange={(_, dateStr) => onChange(dateStr, setEndDate)}
            disabledDate={(date) => disabledDate(date, 'max')}
          />
        </div>
        <div>
          Email: <Input disabled value={profile?.email} />
        </div>
        <div className='flex justify-end gap-2'>
          <Button onClick={handleOpenStatementModal}>Cancel</Button>
          <Button
            type='primary'
            disabled={!(startDate && endDate)}
            loading={loading}
            onClick={handleRequestStatement}>
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default RequestStatementModal
