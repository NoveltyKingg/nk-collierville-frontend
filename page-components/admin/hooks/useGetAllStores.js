import useRequest from '@/request'

const useGetAllStores = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET', url: 'admin/getStores' },
    { manual: true },
  )
  const getAllStores = () => {
    try {
      trigger({})
    } catch (error) {
      console.error(error, 'error')
    }
  }

  return { getAllStores, allStoresData: data, loading }
}

export default useGetAllStores
