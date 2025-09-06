import { message } from 'antd'
import { useRouter } from 'next/router'
import useRequest from '@/request'
import setCookie from '@/utils/set-cookie'

const useSubmitRegistration = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'post', url: '/auth/registration' },
    { manual: true },
  )

  const { push } = useRouter()

  const submitRegistration = async ({ formattedData }) => {
    const hide = message.loading('Loading...', 0)
    try {
      const triggerData = await trigger({ data: formattedData })
      hide()
      message.success(
        'Registration Successfull. Give our executive some time to accept your registration',
      )
      setCookie('novelty-token', triggerData?.data)
      push('/')
    } catch (error) {
      console.error(error, 'error')
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { data, loading, submitRegistration }
}

export default useSubmitRegistration
