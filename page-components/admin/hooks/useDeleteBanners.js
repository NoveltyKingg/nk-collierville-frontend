import { message } from 'antd'
import useRequest from '@/request'

const useDeleteBanners = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'DELETE', url: '/home/deleteBanners' },
    { manual: true },
  )

  const deleteBanners = async ({ imageUrl, imageUrls } = {}) => {
    try {
      console.log('useDeleteBanners called with:', { imageUrl, imageUrls })

      let imageUrlsArray = []
      
      if (Array.isArray(imageUrls) && imageUrls.length > 0) {
        imageUrlsArray = imageUrls
      } else if (imageUrl) {
        imageUrlsArray = [imageUrl]
      } else {
        message.error('No image specified to delete')
        return false
      }

      console.log('Sending DELETE request with array:', imageUrlsArray)
      const res = await trigger({ data: imageUrlsArray })
      console.log('Delete response:', res)

      const ok = res?.status === 200 || res?.data?.success
      if (ok) {
        console.log('Delete successful')
        return true
      }

      console.log('Delete failed:', res?.data?.message)
      message.error(res?.data?.message || 'Failed to delete banner')
      return false
    } catch (err) {
      console.error('Delete error:', err)
      message.error(err?.data?.message || 'Failed to delete banner')
      return false
    }
  }

  return {
    deleteBanners,
    deleting: loading,
    response: data,
  }
}

export default useDeleteBanners


