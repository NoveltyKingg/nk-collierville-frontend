import useRequest from '@/request'
import { App } from 'antd'

const useGetProductsByCategory = ({ setProductsData }) => {
  const [{ data, loading }, trigger] = useRequest(
    { url: 'product/searchByFilter', method: 'GET' },
    { manual: true },
  )

  const { message } = App.useApp()

  const getProductsByCategory = async ({ category, subCategory }) => {
    const hide = message.loading('Loading Products...', 0)
    try {
      const triggerData = await trigger({
        params: {
          categoryId: category,
          subCategoryId: subCategory,
        },
      })
      hide()
      setProductsData({ products: triggerData?.data })
      message.success('Fetched products successfully')
    } catch (error) {
      console.error('error: ', error)
      hide()
      message.error(error?.data?.message || 'Failed to fetch products')
    }
  }

  return { getProductsByCategory, productsData: data, productsLoading: loading }
}

export default useGetProductsByCategory
