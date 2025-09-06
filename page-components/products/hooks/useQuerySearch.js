import { message } from 'antd'
import useRequest from '@/request'

const useQuerySearch = ({ setProductsData }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET', url: '/product/search' },
    { manual: true },
  )

  const querySearch = async ({ query }) => {
    const hide = message.loading('Loading...', 0)
    try {
      const triggerData = await trigger({
        params: {
          query,
        },
      })
      hide()
      setProductsData({ products: triggerData?.data })
      message.success('Fetched Products Successfully')
    } catch (err) {
      console.error(err)
      hide()
      message.error(err?.data?.message || 'Something Went Wrong')
    }
  }

  return {
    querySearch,
    queryData: data,
    queryLoading: loading,
    queryTrigger: trigger,
  }
}

export default useQuerySearch
