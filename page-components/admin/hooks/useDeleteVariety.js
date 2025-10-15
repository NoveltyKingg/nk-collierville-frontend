import { message } from 'antd'
import useRequest from '@/request'

const useDeleteVariety = ({ varietyId }) => {
  const [{ data, loading, error }, trigger] = useRequest(
    { method: 'DELETE' },
    { manual: true },
  )

  const { message } = App.useApp()

  const deleteVariety = async () => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({ url: `/product/variant/${varietyId}` })
      hide()
      message.succes('variation Deleted Successfully')
    } catch (err) {
      console.error(err)
      hide()
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
