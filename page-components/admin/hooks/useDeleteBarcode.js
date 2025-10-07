import { message } from 'antd'
import useRequest from '@/request'

const useDeleteBarcode = ({ barcode, getVarities, setDeletedBarcode }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'DELETE' },
    { manual: true },
  )

  const deleteBarcode = async () => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({ url: `/barcode/${barcode}` })
      hide()
      message.success('Deleted Successfully')
      setDeletedBarcode()
      getVarities()
    } catch (error) {
      console.error('error:', error)
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { deleteBarcode, data, deleteBarcodeLoading: loading }
}

export default useDeleteBarcode
