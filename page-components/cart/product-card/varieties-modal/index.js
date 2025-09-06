import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import VarietiesTable from '@/components/varities-table'
import useIsMobile from '@/utils/useIsMobile'

function VarietiesModal({
  handleCancelVarietiesModal,
  open,
  varietiesData,
  varitiesAdded,
  productData,
  updateLoading,
  deleteLoading,
  getCartItems,
  isEditOrder,
  isEditOrderUpdate,
  itemCartId,
  getOrderDetails,
  productQuantity,
}) {
  const [addedQuantity, setAddedQuantity] = useState({})
  const { isMobile } = useIsMobile()

  useEffect(() => {
    setAddedQuantity(varitiesAdded)
  }, [varitiesAdded])

  return (
    <Modal
      open={open}
      onCancel={handleCancelVarietiesModal}
      title='Varieties'
      width={800}
      style={{ maxHeight: 600, overflow: 'auto' }}
      footer={null}>
      <VarietiesTable
        setAddedQuantity={setAddedQuantity}
        addedQuantity={addedQuantity}
        varietiesData={varietiesData}
        productData={productData}
        isUpdate
        updateLoading={updateLoading}
        deleteLoading={deleteLoading}
        getCartItems={getCartItems}
        isEditOrder={isEditOrder}
        itemCartId={itemCartId}
        isEditOrderUpdate={isEditOrderUpdate}
        getOrderDetails={getOrderDetails}
        isMobile={isMobile}
        productQuantity={productQuantity}
      />
    </Modal>
  )
}

export default VarietiesModal
