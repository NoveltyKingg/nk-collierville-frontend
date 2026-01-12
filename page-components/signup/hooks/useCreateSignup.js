import useRequest from '@/request'
import setCookie from '@/utils/set-cookie'
import { App } from 'antd'

const useCreateSignup = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'post', url: '/auth/signupWithOtp' },
    { manual: true },
  )

  const { message } = App.useApp()

  const createSignup = async (payload) => {
    const hide = message.loading('Loading...', 0)
    try {
      const triggerData = await trigger({
        data: payload,
      })
      hide()
      setCookie('nk-collierville-token', triggerData?.data)
      location.replace('/registration')
    } catch (error) {
      console.error('error: ', error)
      hide()
      message.error(error?.data?.message || 'Unable to create account')
    }
  }

  return { createSignup, signupLoading: loading, createSignupData: data }
}

export default useCreateSignup
