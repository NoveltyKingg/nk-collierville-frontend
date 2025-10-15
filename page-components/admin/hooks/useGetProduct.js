import useRequest from '@/request'

const useGetProduct = ({ product }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET' },
    { manual: true },
  )

  const getProduct = () => {
    try {
      trigger({ url: `product/${product}` })
    } catch (error) {
      console.error('error:', error)
    }
  }

  return { getProduct, data, loading }
}

export default useGetProduct
