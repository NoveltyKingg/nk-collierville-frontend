import { App } from 'antd'
import useRequest from '@/request'

const useGetAdminApproval = ({ storeId }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST' },
    { manual: true },
  )

  const { message } = App.useApp()

  const getAdminApproval = async ({ formData }) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({
        params: { ...formData },
        url: `/admin/approval/${storeId}`,
      })
      hide()
      message.success('Approved')
    } catch (error) {
      console.error(error, 'error')
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { getAdminApproval, data, loading }
}

export default useGetAdminApproval
