import useRequest from '@/request'
import { App } from 'antd'

const useGetSignupOTP = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'post', url: '/auth/signup' },
    { manual: true },
  )

  const { message } = App.useApp()

  const getSignupOTP = async ({ email }) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({
        data: { email },
      })
      hide()
      message.success('An OTP has been sent to your email address', 0)
    } catch (error) {
      console.error(error, 'error')
      hide()
      message.error(error?.data?.message || 'Unable to Signup', 0)
    }
  }

  return { signUpOTPData: data, loading, getSignupOTP }
}

export default useGetSignupOTP
