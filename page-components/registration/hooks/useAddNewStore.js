import { App } from 'antd'
import useRequest from '@/request'

const useAddNewStore = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST' },
    { manual: true },
  )

  const { message } = App.useApp()

  const addNewStore = async ({ formData, userId, handleClose }) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({
        data: formData,
        url: `user/${userId}/store/create`,
      })
      hide()
      message.success('Added Store Successfully')
      if (handleClose) handleClose()
    } catch (error) {
      console.error(error, 'error')
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { data, newStoreLoading: loading, addNewStore }
}

export default useAddNewStore
