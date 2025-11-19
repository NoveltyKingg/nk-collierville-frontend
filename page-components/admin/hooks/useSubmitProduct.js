import useRequest from '@/request'
import { App } from 'antd'

const useSubmitProduct = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST', url: 'product/save' },
    { manual: true },
  )

  const { message } = App.useApp()

  const submitProduct = async ({ formData, setDisabled }) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({
        data: formData,
      })
      hide()
      setDisabled(true)
      message.success('Product Submitted Successfully')
    } catch (err) {
      console.error(err, 'err')
      hide()
      message.error(err?.data?.message || 'Something Went Wrong')
    }
  }

  return { data, submitProduct, loading }
}

export default useSubmitProduct
