import { App } from 'antd'
import useRequest from '@/request'

const useGetCartItems = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET' },
    { manual: true },
  )

  const { message } = App.useApp()

  const getCartItems = async ({ storeId }) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({ url: `store/${storeId}/cart` })
      hide()
      message.success('Cart Items Fetched Successfully')
    } catch (error) {
      console.error(error, 'error')
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { getCartItems, cartData: data, loading }
}

export default useGetCartItems
