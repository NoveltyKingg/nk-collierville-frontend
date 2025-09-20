import { message } from 'antd'
import useRequest from '@/request'

const useUpdatePromotionalBannerLink = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST', url: 'home/promotions/uploadBannerLinks' },
    { manual: true },
  )

  const updateBannerLink = async ({ imageUrl, linkUrl }) => {
    try {
      const response = await trigger({ 
        data: { 
          [imageUrl]: linkUrl || null
        } 
      })
      message.success('Promotional banner link updated successfully!')
      return response
    } catch (err) {
      message.error(err?.data?.message || 'Failed to update promotional banner link')
      throw err
    }
  }

  return {
    updateBannerLink,
    updating: loading,
    response: data,
  }
}

export default useUpdatePromotionalBannerLink

