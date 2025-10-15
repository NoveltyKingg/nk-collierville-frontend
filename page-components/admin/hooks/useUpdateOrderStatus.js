import { App } from 'antd'
import useRequest from '@/request'

const useUpdateOrderStatus = ({
  orderId,
  status,
  setStatusChange,
  setOrderId,
  getOrdersList,
}) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST' },
    { manual: true },
  )

  const { message } = App.useApp()

  const updateOrderStatus = async () => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({ url: `/admin/order/${orderId}/status/${status}` })
      hide()
      message.success('Updated successfully')
      setStatusChange({})
      setOrderId()
      getOrdersList()
    } catch (error) {
      console.error(error, 'error')
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { updateOrderStatus, data, loading }
}

export default useUpdateOrderStatus
