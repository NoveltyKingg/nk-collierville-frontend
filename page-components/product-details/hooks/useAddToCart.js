import { App } from 'antd'
import useRequest from '@/request'
import useGetContext from '@/common/context/useGetContext'

const useAddToCart = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST', url: '/store/addToCart' },
    { manual: true },
  )

  const { message } = App.useApp()

  const { dispatchData, AVAILABLE_ACTIONS } = useGetContext()

  const addToCart = async ({
    productId,
    quantity,
    storeId,
    variationId,
    feature,
  }) => {
    const hide = message.loading('Loading...', 0)
    try {
      const IDS = productId ? { productId } : { variationId }
      const features = Object.keys(feature || {})?.length > 0 ? { feature } : {}
      console.log(IDS, features, 'IDSFeatures')
      const triggerData = await trigger({
        data: {
          storeId,
          quantity,
          ...IDS,
          ...features,
        },
      })
      hide()
      dispatchData(AVAILABLE_ACTIONS.ADD_PROFILE, {
        cartItems: triggerData?.data,
      })
      message.success('Added to Cart')
    } catch (error) {
      console.error(error, 'error')
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { addToCart, data, addtoCartLoading: loading }
}

export default useAddToCart
