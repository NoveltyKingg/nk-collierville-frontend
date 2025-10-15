import React from 'react'
import { Modal } from 'antd'
import Registration from '@/page-components/registration'

function AddNewStore({ openAddStore, handleClose }) {
  return (
    <Modal
      open={openAddStore}
      onCancel={handleClose}
      footer={null}
      width='min(100%, 900px)'
      styles={{ body: { padding: 0 } }}
      className='rounded-2xl overflow-hidden'>
      <Registration isAddNewStore handleClose={handleClose} />
    </Modal>
  )
}

export default AddNewStore
