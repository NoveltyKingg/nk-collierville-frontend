import { message } from 'antd'
import useRequest from '@/request'

const useAddToOrder = () => {
  const { data, loading, trigger } = useRequest(
    { method: 'POST' },
    { manual: true },
  )

  const addToOrder = async ({
    productId,
    quantity,
    storeId,
    variationId,
    feature,
    orderId,
  }) => {
    const hide = message.loading('Loading...', 0)
    const IDS = productId ? { productId } : { variationId }
    const features = Object.keys(feature)?.length > 0 ? { feature } : {}
    try {
      await trigger({
        url: `order/${orderId}/addToOrder`,
        data: {
          storeId,
          quantity,
          ...IDS,
          ...features,
        },
      })
      hide()
      message.success('Added To Order')
    } catch (error) {
      console.error(error)
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { addToOrder, addToOrderLoading: data, loading }
}

export default useAddToOrder
