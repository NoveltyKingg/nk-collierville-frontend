import { App } from 'antd'
import useRequest from '@/request'

const useUpdateProfile = ({ userId }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST', url: `/user/${userId}/profile` },
    { manual: true },
  )

  const { message } = App.useApp()

  const updateProfile = async ({ formData }) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({
        data: formData,
      })
      hide()
      message.success('Updated successfully')
    } catch (error) {
      console.error(error, 'error')
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { updatedData: data, loading, updateProfile }
}
export default useUpdateProfile
