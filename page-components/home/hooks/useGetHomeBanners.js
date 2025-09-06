import { message } from 'antd'
import useRequest from '@/request'

const useGetHomeBanners = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET', url: '/home/getBanners' },
    { manual: true },
  )

  const getHomeBanners = async () => {
    try {
      await trigger({})
    } catch (err) {
      console.error(err)
      message.error(err?.data?.message || 'Something Went Wrong')
    }
  }

  return {
    getHomeBanners,
    homeBanners: data,
    homeLoading: loading,
  }
}

export default useGetHomeBanners
