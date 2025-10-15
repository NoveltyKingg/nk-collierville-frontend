import { App } from 'antd'
import useRequest from '@/request'
import useGetContext from '@/common/context/useGetContext'

const useUpdateCart = ({ getCartItems }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST', url: '/store/updateCart' },
    { manual: true },
  )

  const { message } = App.useApp()

  const { dispatchData, AVAILABLE_ACTIONS } = useGetContext()

  const updateCart = async ({
    productId,
    quantity,
    storeId,
    variationId,
    feature,
  }) => {
    const hide = message.loading('Loading...', 0)
    try {
      const triggerData = await trigger({
        data: {
          productId,
          quantity,
          storeId,
          variationId,
          feature,
        },
      })
      hide()
      dispatchData(AVAILABLE_ACTIONS.ADD_PROFILE, {
        cartItems: triggerData?.data,
      })
      message.success('Cart Updated')
      getCartItems()
    } catch (error) {
      console.error(error, 'error')
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { updateCart, data, updateLoading: loading }
}

export default useUpdateCart
