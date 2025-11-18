import useRequest from '@/request'
import { App } from 'antd'

const useDeleteSubCategory = ({
  subCategoryId,
  setSubCategoryId,
  getCategories,
}) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'DELETE' },
    { manual: true },
  )

  const { message } = App.useApp()

  const deleteSubCategory = async () => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({
        url: `/subcategory/${subCategoryId}`,
      })
      hide()
      setSubCategoryId()
      getCategories()
      message.success('Sub-Category Deleted Successfully')
    } catch (err) {
      console.error(err, 'err')
      hide()
      message.error(err?.data?.message || 'Something Went Wrong')
    }
  }

  return { data, deleteSubCategory, loading }
}

export default useDeleteSubCategory
