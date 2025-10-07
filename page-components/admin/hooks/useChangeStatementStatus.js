import { message } from 'antd'
import useRequest from '@/request'

const useChangeStatementStatus = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST', url: 'admin/statement' },
    { manual: true },
  )
  const changeStatementStatus = async ({ statementId }) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({
        params: { id: statementId },
      })
      hide()
      message.success('Marked as Done')
    } catch (error) {
      console.error(error)
      hide()
      message.error(error?.data?.message || 'Something went wrong')
    }
  }

  return { changeStatementStatus, data, loading }
}

export default useChangeStatementStatus
