import { App } from 'antd'
import useRequest from '@/request'

const useAddBarcode = ({ barcode, getVarities }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST' },
    { manual: true },
  )

  const { message } = App.useApp()

  const addBarcode = async ({
    productId,
    variationId,
    setProductBarcodes,
    setBarcode,
  }) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({
        params: {
          productId,
          variationId,
        },
        url: `/barcode/${barcode}`,
      })
      hide()
      message.success('Barcode Added Successfully')
      variationId && getVarities()
      if (setProductBarcodes) {
        setProductBarcodes((prev) => [...prev, barcode])
      }
      if (setBarcode) {
        setBarcode()
      }
    } catch (err) {
      console.error('error: ', err)
      hide()
      message.error(err?.data?.message || 'Something Went Wrong')
    }
  }

  return { addBarcode, barcodeData: data, addBarcodeLoading: loading }
}

export default useAddBarcode
