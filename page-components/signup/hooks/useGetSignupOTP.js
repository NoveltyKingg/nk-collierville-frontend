import useRequest from '@/request'
import { message } from 'antd'

const useGetSignupOTP = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'post', url: '/auth/signup' },
    { manual: true },
  )

  const getSignupOTP = async ({ email }) => {
    try {
      await trigger({
        data: { email },
      })
      message.success('An OTP has been sent to your email address', 0)
    } catch (error) {
      console.error(error, 'error')
      message.error(error?.data?.message || 'Unable to Signup', 0)
    }
  }

  return { signUpOTPData: data, loading, getSignupOTP }
}

export default useGetSignupOTP
