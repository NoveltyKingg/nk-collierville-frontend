import { message } from 'antd'
import useRequest from '@/request'

const useUpdateBannerLink = (url) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST', url },
    { manual: true },
  )

  const updateBannerLink = async ({ imageUrl, linkUrl }) => {
    const hide = message.loading('Updating banner link...', 0)
    try {
      const response = await trigger({
        data: {
          [imageUrl]: linkUrl || null,
        },
      })
      hide()
      message.success('Banner link updated successfully!')
      return response
    } catch (err) {
      hide()
      message.error(err?.data?.message || 'Failed to update banner link')
    }
  }

  return {
    updateBannerLink,
    updating: loading,
    response: data,
  }
}

export default useUpdateBannerLink
