import { App } from 'antd'
import useRequest from '@/request'

const useGetCategories = ({ setData }) => {
  const [{ data, loading, error }, trigger] = useRequest(
    { method: 'GET', url: 'category/getAll' },
    { manual: true },
  )

  const { message } = App.useApp()

  const getCategories = async () => {
    try {
      const triggerData = await trigger({})
      setData(triggerData?.data)
    } catch (err) {
      console.error(err)
      message.error(err?.data?.message || 'Something Went Wrong')
    }
  }

  return {
    getCategories,
    categoryData: data,
    categoryLoading: loading,
    error,
  }
}

export default useGetCategories
