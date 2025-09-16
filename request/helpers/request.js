import { getCookie } from '@/utils/get-cookie'
import setCookie from '@/utils/set-cookie'
import { message } from 'antd'
import Axios from 'axios'

const request = Axios.create()

const config = {
  novelty: {
    tokenKey: 'nk-collierville-token',
  },
  public: { options: {} },
}

const logout = () => {
  setCookie('nk-collierville-token', 'expired', -1)
}

request.interceptors.request.use((oldAxiosConfig) => {
  const { ...axiosConfig } = oldAxiosConfig
  const { tokenKey } = config.novelty
  const token = getCookie(tokenKey)

  axiosConfig.timeout = 300000

  axiosConfig.paramsSerializer = {
    indexes: false,
  }

  axiosConfig.baseURL = process.env.NEXT_PUBLIC_REST_BASE_API_URL
  if (token) {
    axiosConfig.headers.authorization = `Bearer ${token}`
  }

  return axiosConfig
})

request.interceptors.response.use(
  (response) => ({
    hasError: false,
    data: response?.data,
    status: response?.status,
  }),
  async (error) => {
    if (error.response) {
      const { status } = error?.response || {}

      if (status !== 200 && status !== 401) {
        const res = error?.response?.data
        return Promise.reject({ status, data: res, hasError: true })
      }

      if (status === 401) {
        logout()
        message.error('Token Expired')
        window.location.reload()
      }
    }
    return Promise.reject(error)
  }
)

export default request
