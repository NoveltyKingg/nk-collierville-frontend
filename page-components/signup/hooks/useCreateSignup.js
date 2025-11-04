import useRequest from '@/request'
import { App } from 'antd'
import { useRouter } from 'next/router'

const useCreateSignup = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'post', url: '/auth/signup' },
    { manual: true },
  )

  const { message } = App.useApp()
  const { push } = useRouter()

  const createSignup = async (payload) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({
        data: payload,
      })
      hide()
      message.success('Sucessfully created your account')
      push('/registration')
    } catch (error) {
      console.error('error: ', error)
      hide()
      message.error(error?.data?.message || 'Unable to create account')
    }
  }

  return { createSignup, loading, createSignupData: data }
}

export default useCreateSignup
