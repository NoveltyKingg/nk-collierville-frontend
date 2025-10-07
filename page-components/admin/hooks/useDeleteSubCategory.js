import showMessage from '@/utils/showMessage'
import useRequest from '@/request'
import { message } from 'antd'

const useDeleteSubCategory = ({
  subCategoryId,
  setSubCategoryId,
  getCategories,
}) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'DELETE' },
    { manual: true },
  )

  const deleteSubCategory = async () => {
    const hide = message.loading('Loading...', 0)
    try {
      const triggerData = await trigger({
        url: `/subcategory/${subCategoryId}`,
      })
      hide()
      setSubCategoryId()
      getCategories()
      triggerData?.hasError
        ? showMessage('Something Went Wrong', 'error')
        : showMessage('Deleted Successfully', 'success')
    } catch (err) {
      console.error(err, 'err')
      hide()
      showMessage(err?.data?.message || 'Something Went Wrong', 'error')
    }
  }

  return { data, deleteSubCategory, loading }
}

export default useDeleteSubCategory
