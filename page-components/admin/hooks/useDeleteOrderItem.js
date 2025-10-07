import { message } from 'antd'
import useRequest from '@/request'

const useDeleteOrderItem = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'DELETE', url: 'order/item' },
    { manual: true },
  )

  const deleteOrderItem = async ({ orderId, orderItemId }) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({
        params: {
          orderId,
          orderItemId,
        },
      })
      hide()
      message.success('Deleted Successfully')
    } catch (error) {
      console.error(error)
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { data, deleteItemLoading: loading, deleteOrderItem }
}
export default useDeleteOrderItem
