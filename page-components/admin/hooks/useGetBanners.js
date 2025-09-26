import useRequest from '@/request'

const useGetBanners = (url) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET', url },
    { manual: true },
  )

  const fetchBanners = async () => { 
    try {
      const res = await trigger()
      
      return Object.entries(res?.data || {}).map(([imageUrl, linkUrl], index) => ({
        id: `banner-${index}`,
        image: imageUrl,
        placeholder: 'Enter banner link URL (e.g., https://example.com)',
        linkUrl: linkUrl || ''
      }))
    } catch (e) {
      if (e.name !== 'CanceledError' && e.message !== 'canceled') {
        console.error('Failed to fetch banners:', e)
      }
      return []
    }
  }

  return {
    fetchBanners,
    banners: data ? Object.entries(data).map(([imageUrl, linkUrl], index) => ({
      id: `banner-${index}`,
      image: imageUrl,
      placeholder: 'Enter banner link URL (e.g., https://example.com)',
      linkUrl: linkUrl || ''
    })) : [],
    loading,
    data
  }
}

export default useGetBanners
