import React, { useEffect, useState } from 'react'
import { Button, Card, Empty } from 'antd'
import uniqid from 'uniqid'
import { useRouter } from 'next/router'
import ProductCard from './product-card'
import useGetCartItems from './hooks/useGetCartItems'
import useGetContext from '@/common/context/useGetContext'

function Cart() {
  const [selectedProducts, setSelectedProducts] = useState({})
  const [quantity, setQuantity] = useState(0)
  const [price, setPrice] = useState(0)

  const { noveltyData } = useGetContext()
  const { profile } = noveltyData || {}

  const { getCartItems, cartData, loading } = useGetCartItems()

  useEffect(() => {
    if (profile?.storeId) {
      getCartItems({ storeId: profile?.storeId })
    }
  }, [])

  useEffect(() => {
    let selectedItems = {}
    cartData?.forEach((item) => {
      selectedItems = { ...selectedItems, [item?.productId]: true }
    })
    setSelectedProducts(selectedItems)
    let temp = 0
    cartData?.forEach((item) => (temp += item?.quantity))
    setQuantity(temp)
    let tempPrice = 0
    cartData?.forEach(
      (item) => (tempPrice += item?.quantity * item?.productDetails?.sell),
    )
    setPrice(tempPrice)
  }, [cartData])

  const { push } = useRouter()

  return (
    <div className='w-full flex flex-col lg:flex-row items-start gap-4 p-2'>
      <div className='w-full lg:w-80 lg:order-2'>
        <Card>
          <div className='text-lg font-semibold mb-4'>SUMMARY</div>
          <div className='mb-2'>
            Total Items: {Object.values(selectedProducts || {})?.length}
          </div>
          <div className='mb-2'>Total Quantity: {quantity}</div>
          <div className='mb-4'>Subtotal: ${price}</div>
          <Button
            type='primary'
            className='w-full'
            disabled={cartData?.length === 0}
            onClick={() => push(`/${profile?.storeId}/checkout`)}>
            Proceed to Checkout
          </Button>
        </Card>
      </div>
      <div className='w-full lg:flex-1 lg:order-1 flex flex-col gap-4'>
        {!loading &&
          cartData?.length > 0 &&
          cartData?.map((item) => (
            <ProductCard
              product={item}
              key={uniqid()}
              setSelectedProducts={setSelectedProducts}
              selectedProducts={selectedProducts}
              loading={loading}
              getCartItems={getCartItems}
            />
          ))}
        {!loading && cartData?.length === 0 && <Empty />}
        {loading && <Card loading={loading} />}
      </div>
    </div>
  )
}

export default Cart
