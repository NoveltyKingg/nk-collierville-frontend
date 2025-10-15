import { App } from 'antd'
import useRequest from '@/request'

const useGetProduct = ({ setFlavoursData }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET' },
    { manual: true },
  )

  const { message } = App.useApp()

  const getProduct = async (productId) => {
    try {
      const triggerData = await trigger({
        url: `/product/${productId}`,
      })
      const flavoursData = triggerData?.data?.varieties?.map((item) => ({
        id: item?.id,
        key: item?.id,
        name: item?.name,
        imageUrl: item?.imageUrl,
        stock: item?.stock,
      }))
      console.log(flavoursData, 'FLAVDATA')
      setFlavoursData(flavoursData)
    } catch (err) {
      console.error(err)
      message.error(err?.data?.message || 'Something Went Wrong')
    }
  }

  return {
    getProduct,
    productData: data,
    loading,
  }
}

export default useGetProduct
