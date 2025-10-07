import showMessage from '@/utils/show-message'
import useRequest from '@/request'
import { message } from 'antd'

const useDeleteProduct = ({ productId, setProductId, getProducts }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'DELETE' },
    { manual: true },
  )

  const deleteProduct = async () => {
    const hide = message.loading('Loading...', 0)
    try {
      const triggerData = await trigger({ url: `/product/${productId}` })
      hide()
      setProductId()
      triggerData?.hasError
        ? showMessage('Something Went Wrong', 'error')
        : showMessage('Deleted Successfully', 'success')
      getProducts()
    } catch (err) {
      console.error(err, 'err')
      hide()
      showMessage(err?.data?.message || 'Something Went Wrong', 'error')
    }
  }

  return { data, deleteProduct, loading }
}

export default useDeleteProduct
