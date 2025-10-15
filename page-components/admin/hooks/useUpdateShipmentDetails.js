import { App } from 'antd'
import useRequest from '@/request'

const useUpdateShipmentDetails = ({ orderId }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST' },
    { manual: true },
  )

  const { message } = App.useApp()

  const updateShipmentDetails = async ({ formData }) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({
        data: formData,
        url: `admin/order/${orderId}/update-details`,
      })
      hide()
      message.success('Details updated successfully')
    } catch (error) {
      console.error(error)
      hide()
      message.error(error?.data?.message || 'Someting went wrong')
    }
  }

  return { updateShipmentDetails, data, loading }
}

export default useUpdateShipmentDetails
