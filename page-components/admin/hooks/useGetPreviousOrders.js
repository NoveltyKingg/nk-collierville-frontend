import { App } from 'antd'
import useRequest from '@/request'

const useGetPreviousOrders = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET', url: 'store/user/past-purchase' },
    { manual: true },
  )

  const { message } = App.useApp()

  const getPreviousOrders = async ({
    selectedStore,
    selectedUser,
    start,
    end,
  }) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({
        params: {
          userId: selectedUser,
          storeId: selectedStore?.id,
          start,
          end,
        },
      })
      hide()
    } catch (error) {
      console.error(error, 'error')
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { getPreviousOrders, orderData: data, orderLoading: loading }
}

export default useGetPreviousOrders
