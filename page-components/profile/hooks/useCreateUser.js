import { App } from 'antd'
import useRequest from '@/request'

const useCreateUser = () => {
  const [{ data, loading }, trigger] = useRequest(
    { url: '/user/create', method: 'POST' },
    { manual: true },
  )

  const { message } = App.useApp()

  const createUser = async ({ formValues, storeId }) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({ data: { ...formValues, storeId } })
      hide()
      message.success('Added user to this store')
    } catch (error) {
      console.error(error, 'error')
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { createUser, data, loading }
}

export default useCreateUser
