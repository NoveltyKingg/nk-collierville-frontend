import { useEffect } from 'react'
import useRequest from '@/request'

const useGetStatementRequests = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET', url: 'admin/statements' },
    { manual: true },
  )

  const getStatementRequests = () => {
    try {
      trigger({})
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getStatementRequests()
  }, [])
  return { getStatementRequests, data, loading }
}

export default useGetStatementRequests
