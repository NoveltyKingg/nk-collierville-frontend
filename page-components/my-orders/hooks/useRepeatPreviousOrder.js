import { message } from 'antd'
import { useRouter } from 'next/router'
import useRequest from '@/request'
import useGetContext from '@/common/context/useGetContext'

const useRepeatPreviousOrder = ({ storeId }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST', url: `store/${storeId}/repeat-order` },
    { manual: true },
  )
  const { push } = useRouter()
  const { noveltyData } = useGetContext()
  const { profile } = noveltyData || {}

  const repeatPreviousOrder = async (orderId) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({
        params: {
          orderId,
        },
      })
      hide()
      message.success(
        'Order Items added to Cart, you can edit them if you want',
      )
      push(`/${profile?.storeId}/cart`)
    } catch (error) {
      console.error(error, 'error')
      hide()
      message.error(error?.data?.message || 'Something went wrong')
    }
  }

  return { repeatPreviousOrder, data, loading }
}

export default useRepeatPreviousOrder
