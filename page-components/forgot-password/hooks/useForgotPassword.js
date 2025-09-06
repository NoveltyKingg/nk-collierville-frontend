import { message } from 'antd'
import useRequest from '@/request'

const useForgotPassword = () => {
  const [{ data, loading }, trigger] = useRequest(
    {
      method: 'post',
      url: '/auth/forgot-password',
    },
    { manual: true },
  )

  const forgotPassword = async ({ email }) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({
        data: {
          email,
        },
      })
      hide()
      message.success(
        'A Link has been sent to your registered email, please check your email',
      )
    } catch (error) {
      console.error(error, 'error')
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { data, loading, forgotPassword }
}

export default useForgotPassword
