import { message } from 'antd'
import useRequest from '@/request'

const useUpdateNewArrivals = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST', url: 'product/newArrivals' },
    { manual: true },
  )
  const updateNewArrivals = async ({ newArrivals }) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({ data: newArrivals })
      hide()
      message.success('Updated Successfully')
    } catch (error) {
      console.error(error)
      hide()
      message.error(error?.data?.message || 'Something went wrong')
    }
  }

  return { updateNewArrivals, updatedData: data, loading }
}

export default useUpdateNewArrivals
