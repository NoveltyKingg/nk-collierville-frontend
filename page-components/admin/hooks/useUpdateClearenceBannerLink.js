import { message } from 'antd'
import useRequest from '@/request'

const useUpdateClearenceBannerLink = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST', url: 'home/clearance/uploadBannerLinks' },
    { manual: true },
  )

  const updateBannerLink = async ({ imageUrl, linkUrl }) => {
    const hide = message.loading('Updating clearance banner link...', 0)
    try {
      const response = await trigger({ 
        data: { 
          [imageUrl]: linkUrl || null
        } 
      })
      hide()
      message.success('Clearance banner link updated successfully!')
      return response
    } catch (err) {
      hide()
      message.error(err?.data?.message || 'Failed to update clearance banner link')
      throw err
    }
  }

  return {
    updateBannerLink,
    updating: loading,
    response: data,
  }
}

export default useUpdateClearenceBannerLink

