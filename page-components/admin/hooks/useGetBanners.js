import useRequest from '@/request'

const useGetBanners = (url) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET', url },
    { manual: true },
  )

  const fetchBanners = () => { 
    trigger().catch(e => { 
      if (e.name !== 'CanceledError' && e.message !== 'canceled') {
        console.error('Failed to fetch banners:', e)
      }
    })
  }

  return {
    fetchBanners,
    banners: data ? Object.entries(data).map(([imageUrl, linkUrl], index) => ({
      id: `banner-${index}`,
      image: imageUrl,
      linkUrl: linkUrl || ''
    })) : [],
    loading,
    data
  }
}

export default useGetBanners
