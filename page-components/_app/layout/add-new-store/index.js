import { Modal } from 'antd'
import React from 'react'
import Registration from '@/page-components/registration'

function AddNewStore({ openAddStore, handleClose }) {
  return (
    <Modal open={openAddStore} onCancel={handleClose} footer={null} width='60%'>
      <Registration isAddNewStore handleClose={handleClose} />
    </Modal>
  )
}

export default AddNewStore
