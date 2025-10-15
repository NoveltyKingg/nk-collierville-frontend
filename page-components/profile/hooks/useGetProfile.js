import { App } from 'antd'
import useRequest from '@/request'

const useGetProfile = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET' },
    { manual: true },
  )

  const { message } = App.useApp()

  const getProfile = async ({ setPersonalDetails, userId }) => {
    try {
      const triggerData = await trigger({ url: `/user/${userId}/profile` })
      setPersonalDetails({
        first_name: triggerData?.data?.firstName,
        last_name: triggerData?.data?.lastName,
        email_address: triggerData?.data?.email_address,
        mobile_number: triggerData?.data?.phone,
      })
    } catch (error) {
      console.error(error, 'error')
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { data, loading, getProfile }
}

export default useGetProfile
