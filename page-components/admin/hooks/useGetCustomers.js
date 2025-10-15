import { App } from 'antd'
import useRequest from '@/request'

const useGetCustomers = (status) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET' },
    { manual: true },
  )

  const { message } = App.useApp()

  const getCustomers = async () => {
    try {
      await trigger({ url: `admin/getCustomers/${status}` })
    } catch (error) {
      console.error(error, 'error')
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { customersData: data, customersLoading: loading, getCustomers }
}

export default useGetCustomers
