import { App } from 'antd'
import useRequest from '@/request'

const useGetProducts = ({ setProductsData }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET', url: '/subcategory/product/getAll' },
    { manual: true },
  )

  const { message } = App.useApp()

  const getProducts = async ({ subCategoriesList, pagination, sorting }) => {
    const hide = message.loading('Loading...', 0)
    try {
      const triggerData = await trigger({
        params: {
          subCategoryIds: subCategoriesList,
          ...pagination,
          ...sorting,
        },
      })
      hide()
      message.success('Products Fetched Successfully')
      setProductsData(triggerData?.data)
    } catch (error) {
      console.error(error, 'error')
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { data, loading, getProducts }
}

export default useGetProducts
