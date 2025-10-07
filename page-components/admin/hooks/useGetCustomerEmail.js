import { useEffect } from 'react'
import { message } from 'antd'
import useRequest from '@/request'

const useGetCustomerEmail = () => {
  const [{ data, loading, error }, trigger] = useRequest(
    { method: 'GET', url: 'home/getEmailAddress' },
    { manual: true },
  )
  const getCustomerEmail = async () => {
    try {
      await trigger({})
    } catch (err) {
      console.error(err)
      message.error(err?.data?.message || 'Something Went Wrong')
    }
  }

  useEffect(() => {
    getCustomerEmail()
  }, [])

  return {
    getCustomerEmail,
    data,
    loading,
    error,
  }
}

export default useGetCustomerEmail
