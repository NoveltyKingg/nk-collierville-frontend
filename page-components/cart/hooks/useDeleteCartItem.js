import { message } from 'antd'
import useRequest from '@/request'
import useGetContext from '@/common/context/useGetContext'

const useDeleteCartItem = ({ productId, getCartItems }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'DELETE' },
    { manual: true },
  )

  const { dispatchData, AVAILABLE_ACTIONS } = useGetContext()

  const deleteCartItem = async () => {
    const hide = message.loading('Loading...', 0)
    try {
      const triggerData = await trigger({
        url: `store/cart/product/${productId}`,
      })
      hide()
      dispatchData(AVAILABLE_ACTIONS.ADD_PROFILE, {
        cartItems: triggerData?.data,
      })
      message.success('Item deleted successfully')
      getCartItems({})
    } catch (error) {
      console.error(error, 'error')
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { deleteCartItem, data, deleteLoading: loading }
}

export default useDeleteCartItem
