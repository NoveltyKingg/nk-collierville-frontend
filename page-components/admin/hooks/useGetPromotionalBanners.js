import { useState, useCallback } from 'react'
import useRequest from '@/request'

const useGetPromotionalBanners = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET', url: '/home/promotions/getBanners' },
    { manual: true },
  )

  const [promotionalBanners, setPromotionalBanners] = useState([])

  const fetchPromotionalBanners = useCallback(async () => {
    try {
      const res = await trigger()
      const bannerData = res?.data || {}
      
      const bannerList = Object.entries(bannerData).map(([imageUrl, linkUrl]) => ({
        id: imageUrl,
        image: imageUrl,
        placeholder: 'Enter the link',
        value: linkUrl || ''
      }))
      
      setPromotionalBanners(bannerList)
    } catch (e) {
      if (e.name !== 'CanceledError' && e.message !== 'canceled') {
        console.error('Failed to fetch banners:', e)
      }
    }
  }, [trigger])

  return {
    fetchPromotionalBanners,
    promotionalBanners,
    setPromotionalBanners,
    loading,
  }
}

export default useGetPromotionalBanners
