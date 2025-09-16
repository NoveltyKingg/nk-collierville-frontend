import { message } from 'antd'
import useRequest from '@/request'

const useDeleteClearenceBanners = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'DELETE', url: '/home/clearance/deleteBanners' },
    { manual: true },
  )

  const deleteBanners = async ({ imageUrl, imageUrls } = {}) => {
    try {   
      let imagesToDelete = []
      
      if (imageUrls && imageUrls.length > 0) { 
        imagesToDelete = imageUrls
      } else if (imageUrl) { 
        imagesToDelete = [imageUrl]
      }
      
      if (imagesToDelete.length === 0) {
        message.error('No image specified to delete')
        return
      } 

      await trigger({ data: imagesToDelete })
      message.success('Clearance banner deleted successfully!')
    } catch (err) { 
      message.error(err?.data?.message || 'Failed to delete clearance banner')
    }
  }

  return {
    deleteBanners,
    deleting: loading,
  }
}

export default useDeleteClearenceBanners
