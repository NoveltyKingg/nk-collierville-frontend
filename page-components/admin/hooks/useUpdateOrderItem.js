import { message } from 'antd'
import useRequest from '@/request'

const useUpdateOrderItem = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST', url: 'order/item' },
    { manual: true },
  )

  const updateOrderItem = async ({
    orderId,
    orderItemId,
    quantity,
    setEditItems,
    editItems,
  }) => {
    const hide = message.loading('Loading....', 0)
    try {
      await trigger({
        params: {
          orderId,
          orderItemId,
        },
        data: {
          quantity,
        },
      })
      hide()

      const finalValues = editItems.filter(
        (item) => item?.itemCartId !== orderItemId,
      )
      message.success('Updated successfully')
    } catch (error) {
      console.error(error, 'error')
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { updatedOrderDetails: data, loading, updateOrderItem }
}

export default useUpdateOrderItem
