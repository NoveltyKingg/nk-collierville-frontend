import { message } from 'antd'
import useRequest from '@/request'
import useGetContext from '@/common/context/useGetContext'

const useCompleteCheckout = (storeId) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST', url: `/store/${storeId}/checkout` },
    { manual: true },
  )
  const { dispatchData, AVAILABLE_ACTIONS } = useGetContext()

  const completeCheckout = async (address, setOrderCompleted) => {
    try {
      await trigger({
        data: {
          ...address,
        },
      })
      dispatchData(AVAILABLE_ACTIONS.ADD_PROFILE, {
        cartItems: 0,
      })
      setOrderCompleted(true)
    } catch (error) {
      console.error(error, 'error')
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { completeCheckout, checkoutData: data, checkoutLoading: loading }
}

export default useCompleteCheckout
