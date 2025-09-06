import { message } from 'antd'
import useRequest from '@/request'

const useGetPromotionalBanners = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET', url: '/home/promotions/getBanners' },
    { manual: true },
  )

  const getPromotionalBanners = async () => {
    try {
      await trigger({})
    } catch (err) {
      console.error(err)
      message.error(err?.data?.message || 'Something Went Wrong')
    }
  }

  return {
    getPromotionalBanners,
    promotionalBanners: data,
    promotionalLoading: loading,
  }
}

export default useGetPromotionalBanners
