import useRequest from '@/request'
import { App } from 'antd'

const useAddToOrder = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST' },
    { manual: true },
  )

  const { message } = App.useApp()

  const addToOrder = async ({
    productId,
    quantity,
    storeId,
    feature,
    record,
    getOrderDetails,
    orderId,
  }) => {
    const hide = message.loading('Loading...', 0)
    const features = Object.keys(feature || {})?.length > 0 ? { feature } : {}
    try {
      await trigger({
        url: `order/${orderId}/addToOrder`,
        data: {
          storeId,
          quantity,
          productId,
          variationId: record?.id,
          ...features,
        },
      })
      hide()
      message.success('Added To Order')
      getOrderDetails()
    } catch (error) {
      console.error(error)
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { addToOrder, addToOrderLoading: data, loading }
}

export default useAddToOrder
