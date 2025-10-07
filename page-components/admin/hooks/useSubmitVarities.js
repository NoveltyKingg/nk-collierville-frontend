import useRequest from '@/request'
import showMessage from '@/utils/show-message'
import useGetVarities from './useGetVarities'
import { message } from 'antd'

const useSubmitVarities = ({ product, setVaritiesList, setOpen }) => {
  const [{ data, loading, error }, trigger] = useRequest(
    { method: 'POST' },
    { manual: true },
  )
  const { getVarities } = useGetVarities({ product, setVaritiesList })

  const submitVariety = async ({ formData }) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({
        data: formData,
        url: `/product/${product}/variants/save`,
      })
      await getVarities()
      hide()
      showMessage('Success', 'success')
      setOpen(false)
    } catch (err) {
      console.error(err)
      hide()
      showMessage(err?.data?.message || 'Something went wrong', 'error')
    }
  }

  return { data, submitVariety, loading, error }
}

export default useSubmitVarities
