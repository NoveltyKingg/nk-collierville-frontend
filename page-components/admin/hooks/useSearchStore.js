import useRequest from '@/request'

const useSearchStore = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET', url: 'admin/store/search' },
    { manual: true },
  )
  const searchStore = ({ search }) => {
    try {
      trigger({ params: { query: search } })
    } catch (error) {
      console.error(error)
    }
  }

  return { searchStore, storeData: data, searchLoading: loading }
}

export default useSearchStore
