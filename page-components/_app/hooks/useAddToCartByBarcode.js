import useRequest from '@/request'
import { App } from 'antd'

const useAddToCartByBarcode = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST' },
    { manual: true },
  )

  const { message } = App.useApp()

  const addToCartByBarcode = async ({
    barcode,
    quantity,
    storeId,
    setBarcode,
    setQuantityAdded,
  }) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({
        url: `store/addToCart/${barcode}`,
        data: { quantity, storeId },
      })
      hide()
      setBarcode()
      setQuantityAdded(1)
      message.success('Successfully added to cart')
    } catch (error) {
      console.error('error: ', error)
      hide()
      setBarcode()
      setQuantityAdded(1)
      message.error(error?.data?.message || 'Unable to add to cart')
    }
  }
  return { addToCartByBarcode, addToCartData: data, addToCartLoading: loading }
}

export default useAddToCartByBarcode
