import { App } from 'antd'
import useRequest from '@/request'

const useCreateSubCategory = ({ category }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST' },
    { manual: true },
  )

  const { message } = App.useApp()

  const createSubCategory = async ({ formData }) => {
    const hide = message.loading('Loading...', 0)
    try {
      const triggerData = await trigger({
        data: formData,
        url: `/category/${category}/subCategory/create`,
      })
      hide()
      message.success('Sub Category Created Successfully')
    } catch (err) {
      console.error(err, 'err')
      hide()
      message.error(err?.data?.message || 'Something Went Wrong')
    }
  }

  return { data, createSubCategory, loading }
}

export default useCreateSubCategory
