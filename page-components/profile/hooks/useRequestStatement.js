import useRequest from '@/request'
import { message } from 'antd'

const useRequestStatement = ({ userId, storeId }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST', url: `user/${userId}/store/${storeId}/statement` },
    { manual: true },
  )
  const requestStatement = async ({
    startDate,
    endDate,
    handleOpenStatementModal,
  }) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({
        params: {
          start: startDate,
          end: endDate,
        },
      })
      hide()
      handleOpenStatementModal()
      message.success('Success')
    } catch (error) {
      console.error(error)
      hide()
      message.error(error?.data?.message || 'Something Went Wrong')
    }
  }

  return { requestStatement, data, loading }
}

export default useRequestStatement
