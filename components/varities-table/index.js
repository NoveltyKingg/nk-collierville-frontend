import { Button, Input, Space, Table, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import getColumns from './columns'
import useAddToCart from './hooks/useAddToCart'
import useGetContext from '@/common/context/useGetContext'
import useUpdateCart from './hooks/useUpdateCart'
import useDeleteVariation from './hooks/useDeleteVariation'
import useAddToOrder from './hooks/useAddToOrder'

function VarietiesTable({
  setAddedQuantity,
  addedQuantity,
  varietiesData,
  productData,
  isUpdate,
  deleteLoading,
  updateLoading,
  getCartItems,
  isEditOrder,
  itemCartId,
  isEditOrderUpdate,
  getOrderDetails,
  isMobile,
  productQuantity,
}) {
  const [searchText, setSearchText] = useState('')
  const [sortedInfo, setSortedInfo] = useState()
  const [remainingSortedInfo, setRemainingSortedInfo] = useState()
  const [searchedColumn, setSearchedColumn] = useState('')
  const [varietiesChanged, setVarietiesChanged] = useState()
  const [selectedVarieties, setSelectedVarieties] = useState()
  const [remaniningVarieties, setRemainingVarieties] = useState()
  const searchInput = useRef(null)

  const { query } = useRouter()

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const { deleteVariation } = useDeleteVariation(
    addedQuantity,
    setAddedQuantity,
    getCartItems,
  )

  const { push } = useRouter()

  const handleReset = (clearFilters) => {
    clearFilters()
    setSearchText('')
  }

  useEffect(() => {
    const varitiesSelected = []
    const varietiesRemaining = []

    varietiesData?.forEach((item) =>
      Object.keys(addedQuantity || {}).includes(item?.name)
        ? varitiesSelected.push(item)
        : varietiesRemaining.push(item),
    )
    setSelectedVarieties(varitiesSelected)
    setRemainingVarieties(varietiesRemaining)

    if (varietiesData?.length === 0 && Object.keys(productData).length > 0) {
      varietiesRemaining.push({
        name: productData?.name,
        imageUrl: productData?.imageUrls[0],
        quantity: productQuantity,
      })
    }
  }, [varietiesData, addedQuantity])

  const { noveltyData } = useGetContext()
  const { profile } = noveltyData || {}

  const { addToCart } = useAddToCart()
  const { addToOrder } = useAddToOrder()

  const { updateCart } = useUpdateCart()

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter)
  }

  const handleRemainingChange = (pagination, filters, sorter) => {
    setRemainingSortedInfo(sorter)
  }

  const addFlavours = (record, e) => {
    if (e > productData?.orderQuantityLimit) {
      message.error('You cannot order more than order limit for each variety')
    } else {
      setVarietiesChanged({
        ...varietiesChanged,
        [record?.id]: e,
      })
    }
  }

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{
              width: 90,
            }}>
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size='small'
            style={{
              width: 90,
            }}>
            Reset
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              close()
            }}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) => text,
  })

  const handleAddToCart = async (record, e) => {
    if (e > productData?.orderQuantityLimit) {
      message.error('You cannot order more than order limit for each variety')
    }
    if (!profile?.isLoggedIn) {
      push('/login')
    } else if (isUpdate && !isEditOrder && !isEditOrderUpdate) {
      await updateCart({
        storeId: profile?.storeId,
        quantity: e,
        productId: productData?.id,
        addedQuantity,
        setAddedQuantity,
        record,
      })
      getCartItems()
    } else if (isEditOrder) {
      addToOrder({
        storeId: profile?.storeId,
        quantity: e,
        productId: productData?.id,
        addedQuantity,
        setAddedQuantity,
        record,
        itemCartId,
        getOrderDetails,
        orderId: query?.orderId || query?.order_id,
      })
    } else {
      await addToCart({
        storeId: profile?.storeId,
        quantity: e,
        variationId: record?.id,
        productId: productData?.id,
        addedQuantity,
        setAddedQuantity,
        record,
      })
    }
  }

  const selectedColumns = getColumns({
    handleAddToCart,
    addedQuantity,
    addFlavours,
    sortedInfo,
    getColumnSearchProps,
    varietiesChanged,
    deleteOption: true,
    deleteVariation,
    productData,
    updateLoading,
    deleteLoading,
    isEditOrder,
    isMobile,
  })

  const remainingColumns = getColumns({
    handleAddToCart,
    addedQuantity,
    addFlavours,
    sortedInfo: remainingSortedInfo,
    getColumnSearchProps,
    varietiesChanged,
    isEditOrder,
    isMobile,
    productQuantity,
  })

  return (
    <div>
      {isUpdate && varietiesData?.length > 0 && (
        <div>
          <div className='heading'>Selected Flavours: </div>
          <Table
            columns={selectedColumns}
            dataSource={selectedVarieties}
            onChange={handleChange}
            pagination={false}
            size='middle'
          />
          <div className='heading'>Remaining Flavours: </div>
        </div>
      )}
      <Table
        columns={remainingColumns}
        dataSource={isUpdate ? remaniningVarieties : varietiesData}
        onChange={handleRemainingChange}
        pagination={false}
        size='middle'
      />
    </div>
  )
}

export default VarietiesTable
