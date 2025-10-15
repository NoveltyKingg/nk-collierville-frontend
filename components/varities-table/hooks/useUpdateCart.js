import { App } from 'antd'
import useRequest from '@/request'
import useGetContext from '@/common/context/useGetContext'

const useUpdateCart = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST', url: '/store/updateCart' },
    { manual: true },
  )

  const { dispatchData, AVAILABLE_ACTIONS } = useGetContext()

  const { message } = App.useApp()

  const updateCart = async ({
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
          productId,
          quantity,
          storeId,
          variationId: record?.id,
        },
      })
      hide()
      await setAddedQuantity({ ...addedQuantity, [record?.name]: quantity })
      dispatchData(AVAILABLE_ACTIONS.ADD_PROFILE, {
        cartItems: triggerData?.data,
      })
      message.success('Cart Updated')
    } catch (error) {
      console.error(error, 'error')
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { updateCart, data, loading }
}

export default useUpdateCart
