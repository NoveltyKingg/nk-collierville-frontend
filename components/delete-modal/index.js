import React from 'react'
import { Button, Modal } from 'antd'

function DeleteModal({
  open,
  setOpen = () => {},
  handleDelete = () => {},
  handleCancel = () => {},
}) {
  const handleChange = async () => {
    handleDelete()
    setOpen()
  }

  const handleReturn = () => {
    handleCancel()
    setOpen()
  }
  return (
    <Modal
      open={open}
      width={500}
      onCancel={handleReturn}
      footer={[
        <Button key='back' onClick={handleReturn}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' onClick={handleChange}>
          Submit
        </Button>,
      ]}>
      Are you sure you want to delete this?
    </Modal>
  )
}

export default DeleteModal
