import { App } from 'antd'
import { useEffect, useState } from 'react'
import useRequest from '@/request'

const useGetVarities = ({ product, setVaritiesList }) => {
  const [isVariationExist, setIsVariationExist] = useState(true)
  const [{ data, loading }, trigger] = useRequest(
    { method: 'GET' },
    { manual: true },
  )

  const { message } = App.useApp()

  const getVarities = async () => {
    try {
      const triggerData = await trigger({ url: `/product/${product}/variants` })
      setVaritiesList(triggerData?.data)
      setIsVariationExist((triggerData?.data || [])?.length > 0)
    } catch (err) {
      console.error(err)
      message.error(err?.data?.message || 'Something Went Wrong')
    }
  }

  useEffect(() => {
    if (product) getVarities()
  }, [product])

  return {
    getVarities,
    varitiesData: data,
    varitiesLoading: loading,
    isVariationExist,
  }
}

export default useGetVarities
