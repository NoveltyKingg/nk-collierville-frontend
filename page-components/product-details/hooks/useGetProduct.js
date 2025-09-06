import { message } from 'antd'
import useRequest from '@/request'

const useGetProduct = ({ setFlavoursData, setMainImage }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET' },
    { manual: true },
  )

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
      const image = triggerData?.data?.imageUrls[0]
      setMainImage(image)
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
