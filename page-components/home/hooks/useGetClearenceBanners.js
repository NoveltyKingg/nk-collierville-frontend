import { message } from 'antd'
import useRequest from '@/request'

const useGetClearenceBanners = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET', url: '/home/clearance/getBanners' },
    { manual: true },
  )

  const getClearenceBanners = async () => {
    try {
      await trigger({})
    } catch (err) {
      console.error(err)
      message.error(err?.data?.message || 'Something Went Wrong')
    }
  }

  return {
    getClearenceBanners,
    clearenceBanners: data,
    clearenceLoading: loading,
  }
}

export default useGetClearenceBanners
