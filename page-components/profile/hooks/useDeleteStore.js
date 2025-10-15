import { App } from 'antd'
import { useRouter } from 'next/router'
import useRequest from '@/request'
import setCookie from '@/utils/set-cookie'

const useDeleteStore = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST' },
    { manual: true },
  )

  const { message } = App.useApp()

  const { push } = useRouter()

  const deleteStore = async ({ userId, storeId }) => {
    const hide = message.loading('Loading...', 0)
    try {
      const triggerData = await trigger({
        url: `/user/${userId}/store/${storeId}`,
      })
      hide()
      message.success(triggerData?.data || 'Deleted store successfully')
      setCookie('novelty-token', 'expired', -1)
      push('/login')
    } catch (error) {
      console.error(error, 'error')
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { deleteStore, deleteStoreData: data, deleteStoreLoading: loading }
}

export default useDeleteStore
