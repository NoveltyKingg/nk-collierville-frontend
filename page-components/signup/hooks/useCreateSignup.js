import useRequest from '@/request'
import { message } from 'antd'

const useCreateSignup = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'post', url: '/auth/signup' },
    { manual: true },
  )

  const createSignup = async (payload) => {
    try {
      await trigger({
        data: payload,
      })
      message.success('Sucessfully created your account')
    } catch (error) {
      console.error('error: ', error)
      message.error(error?.data?.message || 'Unable to create account')
    }
  }

  return { createSignup, loading, createSignupData: data }
}

export default useCreateSignup
