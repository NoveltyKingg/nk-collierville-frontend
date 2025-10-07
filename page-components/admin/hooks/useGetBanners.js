import { useEffect } from 'react'
import { message } from 'antd'
import useRequest from '@/request'

const useGetBanners = ({ type }) => {
  const [{ data, loading, error }, trigger] = useRequest(
    { method: 'GET' },
    { manual: true },
  )

  const getBanners = async () => {
    try {
      await trigger({ url: `/home/${type ? `${type}/` : ''}getBanners` })
    } catch (err) {
      console.error(err)
      message.error(err?.data?.message || 'Something Went Wrong')
    }
  }

  useEffect(() => {
    getBanners()
  }, [type])

  return {
    getBanners,
    data,
    loading,
    error,
  }
}

export default useGetBanners
