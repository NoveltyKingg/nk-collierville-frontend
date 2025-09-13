import { useState, useCallback } from 'react'
import useRequest from '@/request'

const useGetBanners = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET', url: '/home/getBanners' },
    { manual: true },
  )

  const [banners, setBanners] = useState([])

  const fetchBanners = useCallback(async () => {
    try {
      const res = await trigger()
      const bannerData = res?.data || {}
      
      const bannerList = Object.entries(bannerData).map(([imageUrl, linkUrl]) => ({
        id: imageUrl,
        image: imageUrl,
        placeholder: 'Enter the link',
        value: linkUrl || ''
      }))
      
      setBanners(bannerList)
    } catch (e) {
      if (e.name !== 'CanceledError' && e.message !== 'canceled') {
        console.error('Failed to fetch banners:', e)
      }
    }
  }, [trigger])

  return {
    fetchBanners,
    banners,
    setBanners,
    loading,
  }
}

export default useGetBanners
