import useRequest from '@/request'

const useGetPreviousPurchases = ({ storeId }) => {
  const [{ data, loading }, trigger] = useRequest(
    { url: `/store/${storeId}/past-purchase`, method: 'GET' },
    { manual: true },
  )

  const getPreviousPurchases = async ({ start, end }) => {
    try {
      await trigger({
        params: { start, end },
      })
    } catch (error) {
      console.error(error, 'error')
    }
  }

  return { getPreviousPurchases, data, loading }
}

export default useGetPreviousPurchases
