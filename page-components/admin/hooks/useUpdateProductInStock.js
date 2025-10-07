import { message } from 'antd'
import useRequest from '@/request'

const useUpdateProductInStock = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST', url: 'product/updateInStock' },
    { manual: true },
  )

  const updateProductInStock = ({ status, productId }) => {
    const hide = message.loading('Loading...', 0)
    try {
      trigger({
        params: {
          value: status,
          productId,
        },
      })
      hide()
      message.success('Successfully Updated')
    } catch (error) {
      console.error(error, 'error')
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { data, loading, updateProductInStock }
}

export default useUpdateProductInStock
