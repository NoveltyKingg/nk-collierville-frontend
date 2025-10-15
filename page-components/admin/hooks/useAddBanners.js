import { App } from 'antd'
import useRequest from '@/request'

const useAddBanners = ({ type, getBanners }) => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST' },
    { manual: true },
  )

  const { message } = App.useApp()

  const addBanners = async ({ formData }) => {
    const hide = message.loading('Loading...', 0)
    try {
      await trigger({
        data: formData,
        url: `/home/${type ? `${type}/` : ''}uploadBanners`,
      })
      hide()
      message.success('Banners added successfully')
      getBanners()
    } catch (err) {
      console.error(err, 'err')
      hide()
      message.error(err?.data?.message || 'Something Went Wrong')
    }
  }

  return { data, addBanners, loading }
}

export default useAddBanners
