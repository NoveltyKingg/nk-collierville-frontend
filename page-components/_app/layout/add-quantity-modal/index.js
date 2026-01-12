import { InputNumber } from 'antd'
import { Modal } from 'antd'
import React from 'react'

const AddQuantityModal = ({
  open,
  onCancel,
  handleOk,
  quantityAdded,
  setQuantityAdded,
}) => {
  return (
    <Modal open={open} onCancel={onCancel} onOk={handleOk} title='Quantity'>
      <div className='flex gap-2 items-center'>
        Quantity to Add:
        <InputNumber
          min={1}
          max={9999999}
          value={quantityAdded}
          onPressEnter={handleOk}
          onChange={setQuantityAdded}
        />
      </div>
    </Modal>
  )
}

export default AddQuantityModal
