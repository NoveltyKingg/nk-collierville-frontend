import React, { useEffect, useState } from 'react'
import { Badge, Button, Card, Divider, Image, Radio } from 'antd'
import { startCase } from 'lodash'
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import uniqid from 'uniqid'
import { useRouter } from 'next/router'
import AddAddress from './add-address'
import useGetConfirmCheckout from './hooks/useGetConfirmCheckout'
import useGetContext from '@/common/context/useGetContext'
import useCompleteCheckout from './hooks/useCompleteCheckout'
import OrderCompletion from './order-completion'
import Loading from '@/components/loading'

function Checkout() {
  const [value, setValue] = useState()
  const [deliveryAddress, setDeliveryAddress] = useState([])
  const [addAddress, setAddAddress] = useState(false)
  const [orderCompleted, setOrderCompleted] = useState(false)
  const onChange = (e) => {
    setValue(e.target.value)
  }

  const { push } = useRouter()

  const { noveltyData } = useGetContext()
  const { profile } = noveltyData || {}

  const { getConfirmCheckout, data, loading } = useGetConfirmCheckout(
    profile?.storeId,
  )
  const { completeCheckout, checkoutData, checkoutLoading } =
    useCompleteCheckout(profile?.storeId)

  const handleAddAddress = () => {
    setAddAddress(!addAddress)
  }

  const handlePlaceOrder = () => {
    completeCheckout(deliveryAddress[value], setOrderCompleted)
  }

  useEffect(() => {
    getConfirmCheckout(setDeliveryAddress)
  }, [])

  return (
    <div>
      {!orderCompleted ? (
        <div>
          <Button
            type='link'
            icon={<ArrowLeftOutlined />}
            onClick={() => push(`/${profile?.storeId}/cart`)}>
            Back to Cart
          </Button>
          <div className='heading'>DELIVERY</div>
          <Radio.Group onChange={onChange} value={value}>
            {!loading &&
              deliveryAddress?.map((item, idx) => (
                <Card style={{ width: '100%' }} key={uniqid()}>
                  <Radio value={idx}>
                    {Object.entries(item).map(
                      ([key, val]) =>
                        val &&
                        val !== 'null' && (
                          <div key={uniqid()}>
                            {startCase(key)}: {val}
                          </div>
                        ),
                    )}
                  </Radio>
                </Card>
              ))}
            {loading && <Loading />}
          </Radio.Group>
          {addAddress && (
            <AddAddress
              setDeliveryAddress={setDeliveryAddress}
              deliveryAddress={deliveryAddress}
              setValue={setValue}
              value={value}
              setAddAddress={setAddAddress}
            />
          )}
          <Button icon={<PlusOutlined />} onClick={handleAddAddress}>
            Add New Address
          </Button>
          <Button
            type='primary'
            onClick={handlePlaceOrder}
            loading={checkoutLoading}
            disabled={!(deliveryAddress || {})[value]}>
            Place Order
          </Button>
        </div>
      ) : (
        <OrderCompletion />
      )}
      <div>
        <div className='fs'>SUMMARY</div>
        {data?.items?.map((item) => (
          <div key={uniqid()}>
            <div>
              <Badge count={item?.quantity}>
                <Image
                  src={item?.productDetail?.imageUrls[0]}
                  width={75}
                  height={75}
                  style={{ borderRadius: '8px' }}
                  preview={false}
                  alt='Loading...'
                />
              </Badge>
              <div>{item?.productDetail?.name}</div>
            </div>
            <div>{item?.quantity * item?.price}</div>
          </div>
        ))}
        <Divider />
        <div>
          SubTotal <div>${data?.priceWithoutTax}</div>
        </div>
        <div>
          Tax <div>${data?.tax}</div>
        </div>
        <div>
          Shipping <div>${data?.shipping}</div>
        </div>
        <div>
          Total <div>${data?.totalAmount}</div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
