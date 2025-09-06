import { message } from 'antd'
import useRequest from '@/request'

const useGetConfirmCheckout = (storeId) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST', url: `/store/${storeId}/confirm-checkout` },
    { manual: true },
  )

  const getConfirmCheckout = async (setDeliveryAddress) => {
    try {
      const triggerData = await trigger({})
      const address = {
        address1: triggerData?.data?.address1,
        address2: triggerData?.data?.address2,
        state: triggerData?.data?.state,
        city: triggerData?.data?.city,
        country: triggerData?.data?.country,
        zipCode: triggerData?.data?.zip,
      }
      setDeliveryAddress([address])
    } catch (error) {
      console.error(error, 'error')
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }
  return { getConfirmCheckout, data, loading }
}

export default useGetConfirmCheckout
