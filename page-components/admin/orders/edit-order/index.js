import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Divider, Image, InputNumber, List, Skeleton, Tag } from 'antd'
import useGetOrderDetails from '../../hooks/useGetOrderDetails'
import useUpdateOrderItem from '../../hooks/useUpdateOrderItem'
import useDeleteOrderItem from '../../hooks/useDeleteOrderItem'
import DebounceSelect from '@/components/debounce-select'
import useQuerySearch from '../../hooks/useQuerySearch'
import VarietiesModal from '@/page-components/cart/product-card/varieties-modal'
import CustomizationModal from '@/page-components/cart/product-card/customization-modal'

const COLORS = {
  RECEIVED: 'geekblue',
  IN_PROCESS: '#f2a742',
  SHIPPED: '#87d068',
  HOLD: 'magenta',
  CANCELLED: '#b82431',
}

function EditOrder() {
  const [orderDetails, setOrderDetails] = useState()
  const { query } = useRouter()
  const { getOrderDetails, data } = useGetOrderDetails({
    orderId: query?.order_id,
    setOrderDetails,
  })
  const [editItems, setEditItems] = useState([])
  const [openVarietiesModal, setOpenVarietiesModal] = useState(false)
  const [openCustomizationModal, setOpenCustomizationModal] = useState(false)
  const [openAddNewProduct, setOpenAddNewProduct] = useState(false)
  const [search, setSearch] = useState()
  const { push } = useRouter()

  const { queryTrigger } = useQuerySearch()
  const { updateOrderItem, updatedOrderDetails, loading } = useUpdateOrderItem()
  const { deleteOrderItem, deleteItemLoading } = useDeleteOrderItem()

  const handleEdit = (item) => {
    setEditItems((prev) => {
      const itemExists = prev.some(
        (editItem) => editItem.itemCartId === item?.id,
      )
      if (itemExists) {
        return prev.filter((editItem) => editItem.itemCartId !== item?.id)
      }
      return [...prev, { itemCartId: item?.id, quantity: item?.quantity }]
    })
  }

  const handleDeleteOrderItem = (item) => {
    deleteOrderItem({ orderId: orderDetails?.orderId, orderItemId: item?.id })
  }

  const handleVarietiesModal = (item) => {
    setOpenVarietiesModal({
      [item?.id]: !openVarietiesModal[item?.id],
      varieties: item?.varieties,
    })
  }

  const handleCustomizationModal = (item) => {
    setOpenCustomizationModal({ [item?.id]: true })
  }

  const handleInputChange = (e, item) => {
    setEditItems((prev) =>
      prev.map((val) =>
        val.itemCartId == item?.id ? { ...val, quantity: e } : val,
      ),
    )
  }

  const handleOpenAddNewProduct = () => {
    setOpenAddNewProduct(!openAddNewProduct)
  }

  const handleSelect = (e) => {
    push(`/product/${e}?orderId=${orderDetails?.orderId}&admin=${true}`)
  }

  const handlePressEnter = (e, item) => {
    const orderItemQuantity = editItems?.filter(
      (val) => val?.itemCartId === item?.id,
    )[0]?.quantity
    updateOrderItem({
      orderId: orderDetails?.orderId,
      orderItemId: item?.id,
      quantity: orderItemQuantity,
      setEditItems,
      editItems,
    })
  }

  useEffect(() => {
    getOrderDetails()
  }, [query?.orderId])

  return (
    <div>
      <div>
        <div>
          <div className='header'>
            <div>Order Number #{orderDetails?.orderId}</div>
            <div>
              <Tag color={COLORS[orderDetails?.status]}>
                {orderDetails?.status}
              </Tag>
            </div>
          </div>
          <List
            itemLayout='horizontal'
            dataSource={orderDetails?.items || []}
            bordered
            renderItem={(item) => (
              <List.Item
                actions={[
                  Object.keys(item?.varietiesCount || {}).length > 0 && (
                    <Button onClick={() => handleVarietiesModal(item)}>
                      Varieties
                    </Button>
                  ),
                  Object.keys(JSON.parse(item?.feature || '{}') || {})?.length >
                    0 && (
                    <Button onClick={() => handleCustomizationModal(item)}>
                      Customization
                    </Button>
                  ),
                  <Button
                    onClick={() => handleEdit(item)}
                    loading={loading}
                    disabled={loading}>
                    Edit
                  </Button>,
                  <Button onClick={() => handleDeleteOrderItem(item)}>
                    Delete
                  </Button>,
                ]}>
                <Skeleton avatar title={false} loading={item?.loading} active>
                  <List.Item.Meta
                    avatar={
                      <Image
                        width={60}
                        height={60}
                        alt='Loading...'
                        src={item?.productDetail?.imageUrls[0]}
                      />
                    }
                    title={item?.productDetail?.name || 'Item Name'}
                    description={
                      item?.productDetail?.description || 'Description'
                    }
                  />
                  <div>
                    <InputNumber
                      disabled={
                        !editItems.filter(
                          (val) => val.itemCartId === item?.id,
                        )[0]
                      }
                      onPressEnter={(e) => handlePressEnter(e, item)}
                      onChange={(e) => handleInputChange(e, item)}
                      defaultValue={item?.quantity}
                    />
                  </div>
                </Skeleton>
                {openVarietiesModal[item?.id] && (
                  <VarietiesModal
                    handleCancelVarietiesModal={handleVarietiesModal}
                    open={openVarietiesModal[item?.id]}
                    varietiesData={item?.productDetail?.varieties}
                    varitiesAdded={item?.varietiesCount}
                    productData={item?.productDetail}
                    isEditOrder
                    isEditOrderUpdate
                    itemCartId={item?.id}
                    getOrderDetails={getOrderDetails}
                  />
                )}
                {openCustomizationModal[item?.id] && (
                  <CustomizationModal
                    handleCancelCustomziationModal={handleCustomizationModal}
                    open={openCustomizationModal[item?.id]}
                    productData={item}
                    cartData={JSON.parse(item?.feature || '{}')}
                  />
                )}
              </List.Item>
            )}
          />
          <div>
            {openAddNewProduct && (
              <DebounceSelect
                value={search}
                showSearch
                placeholder='Search'
                optionRoute='/products'
                fetchOptions={queryTrigger}
                handleSelect={handleSelect}
                admin
                onChange={(newValue) => {
                  setSearch(newValue)
                }}
                style={{
                  width: '300px',
                }}
              />
            )}
            <Button onClick={handleOpenAddNewProduct}>Add New Product</Button>
            <div>
              <div>SubTotal: ${orderDetails?.priceWithoutTax}</div>
              <div>Shipping: ${orderDetails?.shipping}</div>
              <div>Tax: ${orderDetails?.tax}</div>
              <Divider />
              <div>Total: ${orderDetails?.totalAmount}</div>
            </div>
          </div>
        </div>
        <div>
          <div>Store Name: {orderDetails?.storeName}</div>
          <div>Address1: {orderDetails?.address1}</div>
          <div>Address2: {orderDetails?.address2 || 'N?A'}</div>
          <div>City: {orderDetails?.city}</div>
          <div>State: {orderDetails?.state}</div>
          <div>Country: {orderDetails?.country}</div>
          <div>Zip: {orderDetails?.zip}</div>
        </div>
      </div>
    </div>
  )
}

export default EditOrder
