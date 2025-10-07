import { message } from 'antd'
import useRequest from '@/request'

const useGetProducts = ({ subCategory }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET' },
    { manual: true },
  )

  const getProducts = async () => {
    const hide = message.loading('Loading...', 0)
    try {
      const triggerData = await trigger({
        url: `/subcategory/${subCategory}/product/getAll`,
      })
      if (triggerData?.data?.length <= 0) {
        message.warning('No Products Found, Please add Products first', 2)
      }
    } catch (err) {
      console.error(err)
      message.error(err?.data?.message || 'Something Went Wrong')
    } finally {
      hide()
    }
  }

  return { getProducts, productData: data, productLoading: loading }
}

export default useGetProducts
