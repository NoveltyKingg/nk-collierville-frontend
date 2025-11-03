import { App } from 'antd'
import useRequest from '@/request'

const useSendQueryEmail = () => {
  const [{ data, loading }, trigger] = useRequest(
    { url: '/home/emailNKAdmin', method: 'POST' },
    { manual: true },
  )

  const { message } = App.useApp()

  const sendQueryEmail = async ({ fieldsValue }) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({
        data: {
          subject: fieldsValue?.query_type,
          body: JSON.stringify({
            name: fieldsValue?.full_name,
            email: fieldsValue?.email_address,
            store_name: fieldsValue?.store_name,
            mobile_number: fieldsValue?.mobile_number,
            issue_description: fieldsValue?.issue_description,
          }),
          to: fieldsValue?.email_address,
        },
      })
      hide()
      message.success('Success', 'success')
    } catch (err) {
      console.error(err, 'err')
      hide()
      message.error(err?.data?.message || 'Something Went Wrong', 'error')
    }
  }

  return { data, sendQueryEmail, loading }
}

export default useSendQueryEmail
