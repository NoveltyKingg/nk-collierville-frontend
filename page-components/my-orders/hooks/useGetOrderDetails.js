import useRequest from '@/request'

const useGetOrderDetails = ({ storeId, orderId }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET', url: `store/${storeId}/order/${orderId}` },
    { manual: true },
  )
  const getOrderDetails = () => {
    try {
      trigger({})
    } catch (error) {
      console.error(error)
    }
  }

  return { getOrderDetails, data, loading }
}

export default useGetOrderDetails
