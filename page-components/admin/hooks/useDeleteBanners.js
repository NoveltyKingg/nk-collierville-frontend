import { message } from 'antd'
import showMessage from '@/utils/showMessage'
import useRequest from '@/request'

const useDeleteBanners = ({ type, getBanners }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'DELETE' },
    { manual: true },
  )

  const deleteBanners = async ({ deletedData }) => {
    const hide = message.loading('Loading...', 0)
    try {
      const triggerData = await trigger({
        data: deletedData,
        url: `/home/${type ? `${type}/` : ''}deleteBanners`,
      })
      hide()
      triggerData?.hasError
        ? showMessage('Something Went Wrong', 'error')
        : showMessage('Success', 'success')
      getBanners()
    } catch (err) {
      console.error(err, 'err')
      hide()
      showMessage(err?.data?.message || 'Something Went Wrong', 'error')
    }
  }

  return { data, deleteBanners, loading }
}

export default useDeleteBanners
