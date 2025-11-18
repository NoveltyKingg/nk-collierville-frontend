import React, { useEffect, useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  Divider,
  Image,
  Input,
  Radio,
  Space,
  Typography,
} from 'antd'
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import uniqid from 'uniqid'
import useGetContext from '@/common/context/useGetContext'
import useGetConfirmCheckout from './hooks/useGetConfirmCheckout'
import useCompleteCheckout from './hooks/useCompleteCheckout'
import AddAddress from './add-address'
import OrderCompletion from './order-completion'
import Loading from '@/components/loading'

const { Title, Text, Link } = Typography

function lineFromAddr(a = {}) {
  const parts = [
    a?.address1,
    a?.address2,
    a?.city,
    a?.state,
    a?.zipcode,
  ].filter(Boolean)
  return parts.join(', ')
}

export default function Checkout() {
  const [selectedIdx, setSelectedIdx] = useState()
  const [deliveryAddress, setDeliveryAddress] = useState([])
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [orderCompleted, setOrderCompleted] = useState(false)

  const [email, setEmail] = useState('')
  const [coupon, setCoupon] = useState('')

  const { noveltyData } = useGetContext()
  const { profile } = noveltyData || {}
  const { push } = useRouter()

  const { getConfirmCheckout, data, loading } = useGetConfirmCheckout(
    profile?.storeId,
  )
  const { completeCheckout, checkoutLoading } = useCompleteCheckout(
    profile?.storeId,
  )

  useEffect(() => {
    getConfirmCheckout(setDeliveryAddress)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totals = useMemo(
    () => ({
      subTotal: Number(data?.priceWithoutTax ?? 0),
      tax: Number(data?.tax ?? 0),
      shipping: Number(data?.shipping ?? 0),
      total: Number(data?.totalAmount ?? 0),
    }),
    [data],
  )

  const handlePlaceOrder = () => {
    completeCheckout(deliveryAddress?.[selectedIdx], setOrderCompleted)
  }

  if (orderCompleted) return <OrderCompletion />

  return (
    <div className='mx-auto w-full p-4 sm:p-6'>
      <Button
        type='link'
        onClick={() => push(`/${profile?.storeId}/cart`)}
        icon={<ArrowLeftOutlined />}
        className='!px-0'>
        Back to cart
      </Button>
      <div className='mt-2 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_420px]'>
        <div className='space-y-6'>
          <Card className='!p-0'>
            <div className='px-4 py-3 sm:px-6'>
              <Title level={4} className='!m-0'>
                Shipping Address
              </Title>
            </div>
            <div className='px-4 pb-4 sm:px-6'>
              <Radio.Group
                onChange={(e) => {
                  setSelectedIdx(e.target.value)
                  setShowAddAddress(false)
                }}
                value={selectedIdx}
                className='w-full'>
                {!loading &&
                  deliveryAddress?.map((a, idx) => (
                    <div key={uniqid()} className='mb-3 bg-white'>
                      <div className='flex items-start border-[#f0f0f0] rounded-lg border-2 gap-3 p-4'>
                        <Radio value={idx} className='mt-1' />
                        <div className='min-w-0 flex-1'>
                          <div className='mt-1 text-sm opacity-75'>
                            {lineFromAddr(a)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {loading && <Loading />}
              </Radio.Group>
              <div className='rounded-lg border-2 border-[#f0f0f0]'>
                <div className='flex items-center gap-3 px-4 py-3'>
                  <Radio
                    checked={showAddAddress}
                    onChange={() => {
                      setShowAddAddress(true)
                      setSelectedIdx()
                    }}
                  />
                  <div className='font-medium'>Add New Address</div>
                </div>
                {showAddAddress && (
                  <div className='p-4'>
                    <AddAddress
                      setDeliveryAddress={setDeliveryAddress}
                      deliveryAddress={deliveryAddress}
                      setAddAddress={setShowAddAddress}
                      setValue={setSelectedIdx}
                    />
                  </div>
                )}
              </div>
            </div>
            <Button
              type='primary'
              onClick={handlePlaceOrder}
              loading={checkoutLoading}
              disabled={!(deliveryAddress || {})[selectedIdx]}>
              Place Order
            </Button>
          </Card>
        </div>

        <div className='space-y-4 lg:sticky lg:top-4 lg:h-fit'>
          <Card className='!p-0'>
            <div className='px-4 py-3'>
              <div className='text-center text-base font-[700]'>
                ORDER SUMMARY
              </div>
            </div>
            <div className='px-4 pb-3'>
              <div className='space-y-3'>
                {data?.items?.map((it) => (
                  <div
                    key={uniqid()}
                    className='flex items-center justify-between gap-3'>
                    <div className='flex items-center gap-3'>
                      <Badge count={it?.quantity} offset={[-6, 6]}>
                        <Image
                          src={it?.productDetail?.imageUrls?.[0]}
                          width={56}
                          height={56}
                          style={{
                            borderRadius: 8,
                            objectFit: 'cover',
                            border: '1px solid #f0f0f0',
                          }}
                          preview={false}
                          alt='Product'
                        />
                      </Badge>
                      <div className='text-sm capitalize'>
                        {it?.productDetail?.name}
                      </div>
                    </div>
                    <div className='shrink-0 text-sm'>
                      $ {Number(it?.quantity * it?.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <Divider className='!my-4' />
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <Text>SubTotal</Text>
                  <Text>$ {totals?.subTotal.toFixed(2)}</Text>
                </div>
                <div className='flex items-center justify-between'>
                  <Text>Tax</Text>
                  <Text>$ {totals?.tax.toFixed(2)}</Text>
                </div>
                <div className='flex items-center justify-between'>
                  <Text>Shipping</Text>
                  <Text>$ {totals?.shipping.toFixed(2)}</Text>
                </div>
                <Divider className='!my-3' />
                <div className='flex items-center justify-between'>
                  <Text strong>Total</Text>
                  <Text strong>$ {totals?.total.toFixed(2)}</Text>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
