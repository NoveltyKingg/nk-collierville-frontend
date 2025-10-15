import { App } from 'antd'
import useRequest from '@/request'

const useGetOrdersList = (status) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET' },
    { manual: true },
  )

  const { message } = App.useApp()

  const getOrdersList = async ({ page, pageSize }) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({
        params: {
          page,
          size: pageSize,
        },
        url: `admin/orders/status/${status}`,
      })
      hide()
      message.success('Success')
    } catch (error) {
      console.error(error, 'error')
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { getOrdersList, data, loading }
}

export default useGetOrdersList
