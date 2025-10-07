import { message } from 'antd'
import useRequest from '@/request'

const useDeleteVariety = ({ varietyId }) => {
  const [{ data, loading, error }, trigger] = useRequest(
    { method: 'DELETE' },
    { manual: true },
  )

  const deleteVariety = async () => {
    try {
      await trigger({ url: `/product/variant/${varietyId}` })
    } catch (err) {
      console.error(err)
      message.error(err?.data?.message || 'Something Went Wrong')
    }
  }

  return {
    deleteVariety,
    categoryData: data,
    categoryLoading: loading,
    error,
  }
}

export default useDeleteVariety
