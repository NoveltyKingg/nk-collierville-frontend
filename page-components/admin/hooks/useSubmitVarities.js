import useRequest from '@/request'
import useGetVarities from './useGetVarities'
import { App } from 'antd'

const useSubmitVarities = ({ product, setVaritiesList, setOpen }) => {
  const [{ data, loading, error }, trigger] = useRequest(
    { method: 'POST' },
    { manual: true },
  )

  const { message } = App.useApp()

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
      message.success('Success')
      setOpen(false)
    } catch (err) {
      console.error(err)
      hide()
      message.error(err?.data?.message || 'Something went wrong')
    }
  }

  return { data, submitVariety, loading, error }
}

export default useSubmitVarities
