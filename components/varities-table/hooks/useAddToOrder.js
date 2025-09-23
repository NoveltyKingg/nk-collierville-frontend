import useRequest from '@/request'
import useToast from '@/utils/show-message'

const useAddToOrder = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST' },
    { manual: true },
  )

  const { loadingMessage, success, error } = useToast()

  const addToOrder = async ({
    productId,
    quantity,
    storeId,
    feature,
    record,
    getOrderDetails,
    orderId,
  }) => {
    const hide = loadingMessage()
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
      success('Added To Order')
      getOrderDetails()
    } catch (error) {
      console.error(error)
      hide()
      error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { addToOrder, addToOrderLoading: data, loading }
}

export default useAddToOrder
