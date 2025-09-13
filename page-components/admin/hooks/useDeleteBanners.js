import { message } from 'antd'
import useRequest from '@/request'

const useDeleteBanners = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'DELETE', url: '/home/deleteBanners' },
    { manual: true },
  )

  const deleteBanners = async ({ imageUrl, imageUrls } = {}) => {
    try {  
      const imagesToDelete = imageUrls?.length > 0 ? imageUrls : imageUrl ? [imageUrl] : []
      
      if (imagesToDelete.length === 0) {
        message.error('No image specified to delete')
        return
      } 

      await trigger({ data: imagesToDelete })
      message.success('Banner deleted successfully!')
    } catch (err) { 
      message.error(err?.data?.message || 'Failed to delete banner')
    }
  }

  return {
    deleteBanners,
    deleting: loading,
  }
}

export default useDeleteBanners
