import useRequest from '@/request'

const useGetBanners = ({ type }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET', url: `/home/${type ? `${type}/` : ''}getBanners` },
    { manual: true },
  )

  const getBanners = () => {
    try {
      trigger()
    } catch {
      console.error('error: ', err)
    }
  }

  return {
    getBanners,
    loading,
    data,
  }
}

export default useGetBanners
