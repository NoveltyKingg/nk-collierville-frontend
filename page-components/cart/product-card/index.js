import { Card, Image, InputNumber, message, Button } from 'antd'
import { DeleteFilled } from '@ant-design/icons'
import React, { useState } from 'react'
import VarietiesModal from './varieties-modal'
import useDeleteCartItem from '../hooks/useDeleteCartItem'
import useGetContext from '@/common/context/useGetContext'
import DeleteModal from '@/components/delete-modal'
import useUpdateCart from '../hooks/useUpdateCart'

function ProductCard({ product, loading, getCartItems }) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openVarietiesModal, setOpenVarietiesModal] = useState()
  const { noveltyData } = useGetContext()
  const { profile } = noveltyData || {}

  const { updateCart, updateLoading } = useUpdateCart({ getCartItems })

  const handleCancel = () => {
    setOpenDeleteModal(!openDeleteModal)
  }

  const handleCancelVarietiesModal = () => {
    setOpenVarietiesModal()
  }

  const handleVarietiesModal = () => {
    setOpenVarietiesModal({ [product?.productId]: true })
  }

  const handleQuantity = (e) => {
    if ((e.keyCode === 13 || e.key === 'Enter') && e?.target?.value > 0) {
      updateCart({
        quantity: e?.target?.value,
        productId: product?.productId,
        storeId: profile?.storeId,
      })
    }
    if ((e.keyCode === 13 || e.key === 'Enter') && e?.target?.value <= 0) {
      message.error(
        'Quantity should atleast be 1, If you want to remove product click on delete Icon',
      )
    }
  }

  const { deleteCartItem, data, deleteLoading } = useDeleteCartItem({
    productId: product?.productId,
    storeId: profile?.storeId,
    getCartItems,
  })

  return (
    <Card hoverable loading={loading}>
      <div
        className='cursor-pointer w-full flex justify-end'
        onClick={handleCancel}>
        <DeleteFilled style={{ fontSize: '16px', color: '#ff8540' }} />
      </div>
      <div className='flex gap-4 items-center'>
        <div className='w-full flex gap-4'>
          <Image
            src={product?.productDetails?.imageUrls[0]}
            width={200}
            height={200}
          />
          <div>
            <div className='text-[18px] font-[900] uppercase'>
              {product?.productDetails?.name}
            </div>
            <Button onClick={handleVarietiesModal} type='link'>
              {' '}
              {Math.max(
                Object.values(product?.varietiesCount || {}).length,
                1,
              )}{' '}
              Item Selected
            </Button>
          </div>
        </div>
        <div className='w-full flex justify-around'>
          <div className='flex flex-col gap-2 text-[16px] uppercase font-[900] items-center'>
            Quantity{' '}
            <InputNumber
              min={1}
              type='number'
              defaultValue={product?.quantity}
              disabled
              onPressEnter={handleQuantity}
            />
          </div>
          <div className=' flex flex-col gap-2 text-[16px] uppercase font-[900] items-center'>
            Unit Price <span>$ {product?.productDetails?.sell}</span>
          </div>
          <div className=' flex flex-col gap-2 text-[16px] uppercase font-[900] items-center'>
            Price{' '}
            <span>$ {product?.quantity * product?.productDetails?.sell}</span>
          </div>
        </div>
      </div>
      {(openVarietiesModal || {})[product?.productId] && (
        <VarietiesModal
          open={openVarietiesModal}
          handleCancelVarietiesModal={handleCancelVarietiesModal}
          varietiesData={product?.productDetails?.varieties}
          varitiesAdded={product?.varietiesCount}
          productData={product?.productDetails}
          deleteLoading={deleteLoading}
          updateLoading={updateLoading}
          getCartItems={getCartItems}
          productQuantity={product?.quantity}
        />
      )}

      {openDeleteModal && (
        <DeleteModal
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
          handleDelete={deleteCartItem}
        />
      )}
    </Card>
  )
}

export default ProductCard
