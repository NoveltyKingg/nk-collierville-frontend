import { message } from 'antd'
import useRequest from '@/request'
import setCookieAndRedirect from '@/utils/set-cookie-and-redirect'
import { useEffect } from 'react'

const useResetPassword = () => {
  const [{ data, loading, response }, trigger] = useRequest(
    {
      method: 'post',
      url: '/auth/reset-password',
    },
    { manual: true },
  )

  const resetPassword = async ({ password }) => {
    const hide = message.loading('Loading...')
    try {
      await trigger({
        data: { password },
      })
      hide()
      message.success('Password Reset Successful')
    } catch (error) {
      console.error(error, 'error')
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  useEffect(() => {
    if (response && response.status === 200) {
      setCookieAndRedirect(data, {})
    }
  }, [response])

  return { data, resetPassowrdLoading: loading, resetPassword }
}

export default useResetPassword
