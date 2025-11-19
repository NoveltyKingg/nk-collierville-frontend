import useRequest from '@/request'
import { App } from 'antd'

const useDeleteProduct = ({ productId, setProductId, getProducts }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'DELETE' },
    { manual: true },
  )

  const { message } = App.useApp()

  const deleteProduct = async () => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({ url: `/product/${productId}` })
      hide()
      setProductId()
      message.success('Product Deleted Successfully')
      getProducts()
    } catch (err) {
      console.error(err, 'err')
      hide()
      message.error(err?.data?.message || 'Something Went Wrong')
    }
  }

  return { data, deleteProduct, loading }
}

export default useDeleteProduct
