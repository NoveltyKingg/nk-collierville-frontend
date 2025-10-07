import { message } from 'antd'
import showMessage from '@/utils/showMessage'
import useRequest from '@/request'

const useAddBanners = ({ type, getBanners }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST' },
    { manual: true },
  )

  const addBanners = async ({ formData }) => {
    const hide = message.loading('Loading...', 0)
    try {
      const triggerData = await trigger({
        data: formData,
        url: `/home/${type ? `${type}/` : ''}uploadBanners`,
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

  return { data, addBanners, loading }
}

export default useAddBanners
