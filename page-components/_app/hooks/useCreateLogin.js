import { useEffect } from 'react'
import { App } from 'antd'
import useRequest from '@/request'
import setCookie from '@/utils/set-cookie'

const useCreateLogin = () => {
  const [{ data, loading, response }, trigger] = useRequest(
    { method: 'POST', url: '/auth/signin' },
    { manual: true },
  )

  const { message } = App.useApp()

  const createLogin = async ({ storeId, token }) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({
        data: { storeId, token },
      })
      hide()
      message.success('Changed Store Successfully')
    } catch (error) {
      console.error(error, 'error')
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  useEffect(() => {
    if (response && response.status === 200) {
      setCookie('novelty-token', data)
    }
  }, [response])

  return { data, loading, createLogin }
}

export default useCreateLogin
