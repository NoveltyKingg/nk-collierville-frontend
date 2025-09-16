import { message } from 'antd'
import useRequest from '@/request'

const useUploadClearenceBanner = () => {
  const [{ data, loading }, trigger] = useRequest(
    { method: 'POST', url: '/home/clearance/uploadBanners' },
    { manual: true },
  )

  const postBanners = async ({ files, formData } = {}) => {
    try {
      let body = formData
      if (!body) {
        body = new FormData()
        const list = Array.isArray(files) ? files : []
        list.forEach((file) => { 
          const fileObject = file && (file.originFileObj || file)
          if (fileObject) {
            const fileBlob = fileObject
            body.append('banners', fileBlob)
          }
        })
      } 

      if (!body.has('banners')) {
        message.error('No files selected')
        return
      }

      await trigger({ data: body })
      message.success('Clearance images uploaded successfully!')
    } catch (err) {
      message.error(err?.data?.message || 'Upload failed. Please try again.')
    }
  }

  return {
    postBanners,
    uploading: loading,
    response: data,
  }
}

export default useUploadClearenceBanner
