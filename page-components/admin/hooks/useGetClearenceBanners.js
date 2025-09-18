import { useState } from 'react'
import useRequest from '@/request'

const useGetClearenceBanners = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET', url: '/home/clearance/getBanners' },
    { manual: true },
  )

  const [clearenceBanners, setClearenceBanners] = useState([])
 
    const fetchClearenceBanners = async () => {
    try {
      const res = await trigger()
      const bannerData = res?.data || {}
      
      const bannerList = Object.entries(bannerData).map(([imageUrl, linkUrl]) => ({
        id: imageUrl,
        image: imageUrl,
        placeholder: 'Enter the link',
        value: linkUrl || ''
      }))
      
      setClearenceBanners(bannerList)
    } catch (e) {
      if (e.name !== 'CanceledError' && e.message !== 'canceled') {
        console.error('Failed to fetch banners:', e)
      }
    }
  }

  return {
    fetchClearenceBanners,
    clearenceBanners,
    setClearenceBanners,
    loading,
  }
}

export default useGetClearenceBanners
