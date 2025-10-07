import { message } from 'antd'
import useRequest from '@/request'

const useDeleteBanners = (url) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'DELETE', url },
    { manual: true },
  )

  const deleteBanners = async (data) => {
    try {
      let imagesToDelete = []

      if (data.imageUrls && data.imageUrls.length > 0) {
        imagesToDelete = data.imageUrls
      } else if (data.imageUrl) {
        imagesToDelete = [data.imageUrl]
      }

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
