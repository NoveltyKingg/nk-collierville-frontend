import showMessage from '@/utils/show-message'
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
      const triggerData = await trigger({
        data: formData,
      })
      hide()
      setDisabled(true)
      triggerData?.hasError
        ? showMessage('Something Went Wrong', 'error')
        : showMessage('Success', 'success')
    } catch (err) {
      console.error(err, 'err')
      hide()
      showMessage(err?.data?.message || 'Something Went Wrong', 'error')
    }
  }

  return { data, submitProduct, loading }
}

export default useSubmitProduct
