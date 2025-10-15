import { App } from 'antd'
import useRequest from '@/request'
import useGetContext from '@/common/context/useGetContext'

const useDeleteVariation = (addedQuantity, setAddedQuantity, getCartItems) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'DELETE', url: '/store/cart/product/variation' },
    { manual: true },
  )

  const { message } = App.useApp()

  const { dispatchData, AVAILABLE_ACTIONS } = useGetContext()

  const deleteVariation = async (productId, variation) => {
    const hide = message.loading('Loading...', 0)
    try {
      const triggerData = await trigger({
        params: {
          productId,
          variationId: variation?.id,
        },
      })
      hide()
      const afterDeletedData = addedQuantity
      delete afterDeletedData[variation?.name]
      setAddedQuantity(afterDeletedData)
      dispatchData(AVAILABLE_ACTIONS.ADD_PROFILE, {
        cartItems: triggerData?.data,
      })
      message.success('Deleted Successfully from cart')
      getCartItems({})
    } catch (error) {
      console.error(error, 'error')
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { deleteVariation, data, loading }
}
export default useDeleteVariation
