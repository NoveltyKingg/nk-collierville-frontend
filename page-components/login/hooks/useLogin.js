import useRequest from '@/request'
import setCookieAndRedirect from '@/utils/set-cookie-and-redirect'
import { useEffect } from 'react'
import { message } from 'antd'

const useLogin = () => {
  const [{ data, loading, response }, trigger] = useRequest(
    { url: 'auth/signin', method: 'post' },
    { manual: true },
  )

  const login = async (email, password) => {
    try {
      await trigger({
        data: { email, password },
      })
      message.success('Logged In Successfully')
    } catch (error) {
      console.error('error: ', error)
      message.success(error?.data?.message || 'Unable to login')
    }
  }

  useEffect(() => {
    if (response && response.status === 200) {
      setCookieAndRedirect(data, {})
    }
  }, [response])

  return { login, data, loading }
}

export default useLogin
