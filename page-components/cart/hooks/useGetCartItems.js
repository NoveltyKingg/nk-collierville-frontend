import { App } from 'antd'
import useRequest from '@/request'

const useGetCartItems = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET' },
    { manual: true },
  )

  const { message } = App.useApp()

  const getCartItems = ({ storeId }) => {
    try {
      trigger({ url: `store/${storeId}/cart` })
    } catch (error) {
      console.error(error, 'error')
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { getCartItems, cartData: data, loading }
}

export default useGetCartItems
