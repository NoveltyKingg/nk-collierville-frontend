import { message } from 'antd'
import useRequest from '@/request'
import useGetContext from '@/common/context/useGetContext'

const useAddToCart = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST', url: '/store/addToCart' },
    { manual: true },
  )

  const { dispatchData, AVAILABLE_ACTIONS } = useGetContext()

  const addToCart = async ({
    productId,
    quantity,
    storeId,
    record,
    addedQuantity,
    setAddedQuantity,
  }) => {
    const hide = message.loading('Loading...', 0)
    try {
      const triggerData = await trigger({
        data: {
          storeId,
          quantity,
          productId,
          variationId: record?.id,
        },
      })
      hide()
      setAddedQuantity({ ...addedQuantity, [record?.name]: quantity })
      dispatchData(AVAILABLE_ACTIONS.ADD_PROFILE, {
        cartItems: triggerData?.data,
      })
      message.success('Added to Cart')
    } catch (error) {
      console.error(error, 'error')
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { addToCart, data, loading }
}

export default useAddToCart
