import useRequest from '@/request'

const useGetRecentlyAdded = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET', url: 'product/recentlyAdded' },
    { manual: true },
  )

  const getRecentlyAdded = async () => {
    try {
      await trigger({})
    } catch (error) {
      console.error('error: ', error)
    }
  }

  return {
    getRecentlyAdded,
    recentlyAddedData: data,
    recentlyAddedLoading: loading,
  }
}

export default useGetRecentlyAdded
