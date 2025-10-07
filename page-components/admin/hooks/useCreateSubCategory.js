import { message } from 'antd'
import showMessage from '@/utils/showMessage'
import useRequest from '@/request'

const useCreateSubCategory = ({ category }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST' },
    { manual: true },
  )

  const createSubCategory = async ({ formData }) => {
    const hide = message.loading('Loading...', 0)
    try {
      const triggerData = await trigger({
        data: formData,
        url: `/category/${category}/subCategory/create`,
      })
      hide()
      triggerData?.hasError
        ? showMessage('Something Went Wrong', 'error')
        : showMessage('Success', 'success')
    } catch (err) {
      console.error(err, 'err')
      hide()
      showMessage(err?.data?.message || 'Something Went Wrong', 'error')
    }
  }

  return { data, createSubCategory, loading }
}

export default useCreateSubCategory
