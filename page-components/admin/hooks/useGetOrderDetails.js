import useRequest from '@/request'
import { App } from 'antd'

const useGetOrderDetails = ({ orderId, setOrderDetails }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET' },
    { manual: true },
  )

  const { message } = App.useApp()

  const getOrderDetails = async () => {
    try {
      const triggerData = await trigger({ url: `/order/${orderId}` })
      setOrderDetails(triggerData?.data)
    } catch (error) {
      console.error('error: ', error)
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { getOrderDetails, data, loading }
}

export default useGetOrderDetails
