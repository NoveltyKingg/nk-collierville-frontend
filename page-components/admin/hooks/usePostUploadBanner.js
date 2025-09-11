import { message } from 'antd'
import useRequest from '@/request'

const usePostBanner = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST', url: '/home/uploadBanners' },
    { manual: true },
  )

  const postBanners = async ({ files, formData } = {}) => {
    try {
      let body = formData
      if (!body) {
        body = new FormData()
        const list = Array.isArray(files) ? files : []
        list.forEach((f) => { 
          const maybe = f && (f.originFileObj || f)
          if (maybe) {
            const fileBlob = maybe
            body.append('banners', fileBlob)
          }
        })
      } 

      if (!body.has('banners')) {
        message.error('No files selected')
        return false
      }

      await trigger({ data: body })
      message.success('Images uploaded successfully!')
      return true
    } catch (err) {
      console.error(err)
      message.error(err?.data?.message || 'Upload failed. Please try again.')
      return false
    }
  }

  return {
    postBanners,
    uploading: loading,
    response: data,
  }
}

export default usePostBanner