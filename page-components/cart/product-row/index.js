import React, { useMemo, useState } from 'react'
import { Button, Image, Select, Popconfirm, message } from 'antd'
import useGetContext from '@/common/context/useGetContext'
import useDeleteCartItem from '../hooks/useDeleteCartItem'
import useUpdateCart from '../hooks/useUpdateCart'
import VarietiesModal from './varieties-modal'

const currency = (n = 0) =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  }).format(Number(n || 0))

function ProductRow({ product, getCartItems }) {
  const [qty, setQty] = useState(Number(product?.quantity || 1))
  const [openVarieties, setOpenVarieties] = useState(false)

  const { noveltyData } = useGetContext()
  const { profile } = noveltyData || {}

  const unit = Number(product?.productDetails?.sell || 0)
  const total = useMemo(() => qty * unit, [qty, unit])

  const { updateCart, updateLoading } = useUpdateCart({ getCartItems })
  const { deleteCartItem, deleteLoading } = useDeleteCartItem({
    productId: product?.productId,
    storeId: profile?.storeId,
    getCartItems,
  })

  const options = Array.from({ length: 100 }, (_, i) => ({
    label: String(i + 1),
    value: i + 1,
  }))

  const commitQty = async (value) => {
    const newQty = Number(value || 1)
    if (newQty < 1) {
      message.error('Quantity must be at least 1')
      setQty(product?.quantity || 1)
      return
    }
    setQty(newQty)
    if (newQty !== product?.quantity) {
      await updateCart({
        quantity: newQty,
        productId: product?.productId,
        storeId: profile?.storeId,
      })
    }
  }

  console.log(product, 'VALUESSSS')

  const varietiesCount =
    Object.values(product?.varietiesCount || {}).length || 0

  return (
    <div className='grid grid-cols-1 md:grid-cols-[1fr_120px_130px_120px] gap-3 md:gap-4'>
      <div className='flex gap-3'>
        <Image
          src={product?.productDetails?.imageUrls?.[0]}
          width={96}
          height={128}
          className='rounded-lg object-cover'
          preview={false}
          alt={product?.productDetails?.name || 'Product image'}
        />
        <div className='flex-1'>
          <div className='font-bold'>{product?.productDetails?.name}</div>
          <div className='text-xs text-emerald-600'>In Stock</div>
          <div className='mt-2 flex flex-wrap gap-3 text-xs'>
            {varietiesCount > 0 && (
              <Button
                type='link'
                className='p-0 h-auto'
                onClick={() => setOpenVarieties(true)}>
                Edit ({varietiesCount} selected)
              </Button>
            )}
            <Popconfirm
              title='Remove this item?'
              okText='Remove'
              okButtonProps={{ danger: true, loading: deleteLoading }}
              onConfirm={deleteCartItem}>
              <Button type='link' className='p-0 h-auto text-red-500'>
                Remove
              </Button>
            </Popconfirm>
          </div>
        </div>
      </div>

      <div className='md:text-right font-semibold self-start'>
        {currency(unit)}
      </div>

      {
        <div className='md:text-center self-start'>
          <Select
            value={qty}
            options={options}
            className='min-w-[100px]'
            onChange={commitQty}
            disabled={updateLoading || varietiesCount > 0}
          />
        </div>
      }

      <div className='md:text-right font-extrabold self-start'>
        {currency(total)}
      </div>

      {openVarieties && (
        <VarietiesModal
          open={{ [product?.productId]: true }}
          handleCancelVarietiesModal={() => setOpenVarieties(false)}
          varietiesData={product?.productDetails?.varieties}
          varitiesAdded={product?.varietiesCount}
          productData={product?.productDetails}
          deleteLoading={deleteLoading}
          updateLoading={updateLoading}
          getCartItems={getCartItems}
          productQuantity={qty}
        />
      )}
    </div>
  )
}

export default ProductRow
