import { message } from 'antd'
import useRequest from '@/request'

const useRemoveArrivals = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'DELETE', url: 'product/newArrivals' },
    { manual: true },
  )

  const removeArrivals = async ({ removedData }) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({ data: removedData })
      hide()
      message.success('Removed Successfully')
    } catch (error) {
      console.error(error)
      hide()
      message.error(error?.data?.message || 'Something went wrong')
    }
  }

  return { removedData: data, loading, removeArrivals }
}

export default useRemoveArrivals
