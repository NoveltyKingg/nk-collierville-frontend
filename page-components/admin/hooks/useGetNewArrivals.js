import { useEffect } from 'react'
import { message } from 'antd'
import useRequest from '@/request'

const useGetNewArrivals = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET', url: '/product/newArrivals' },
    { manual: true },
  )

  const getNewArrivals = async () => {
    try {
      await trigger({})
    } catch (err) {
      console.error(err)
      message.error(err?.data?.message || 'Something Went Wrong')
    }
  }

  useEffect(() => {
    getNewArrivals()
  }, [])

  return {
    getNewArrivals,
    data,
    loading,
  }
}

export default useGetNewArrivals
