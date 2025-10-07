import { message } from 'antd'
import useRequest from '@/request'

const useUpdateBannerLink = ({ type }) => {
  const { data, loading, trigger } = useRequest(
    { method: 'POST' },
    { manual: true },
  )

  const updateBannersLink = async ({ updateData }) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({
        data: updateData,
        url: `home/${type ? `${type}/` : ''}uploadBannerLinks`,
      })
      hide()
      message.success('Updated Link successfully')
    } catch (error) {
      console.error(error)
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { updateBannersLink, updatedData: data, updateLoading: loading }
}

export default useUpdateBannerLink
