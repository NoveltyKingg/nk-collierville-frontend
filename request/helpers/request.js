// helpers/request.js
import Axios from 'axios'
import Router from 'next/router' // <-- singleton, not the hook
import { message } from 'antd' // <-- static API
import { getCookie } from '@/utils/get-cookie'
import setCookie from '@/utils/set-cookie'

const request = Axios.create()

const config = {
  novelty: { tokenKey: 'nk-collierville-token' },
  public: { options: {} },
}

const logout = () => {
  setCookie('nk-collierville-token', 'expired', -1)
}

request.interceptors.request.use((oldAxiosConfig) => {
  const axiosConfig = { ...oldAxiosConfig }
  const { tokenKey } = config.novelty
  const token = getCookie(tokenKey)

  axiosConfig.timeout = 300000
  axiosConfig.paramsSerializer = { indexes: false }
  axiosConfig.baseURL = process.env.NEXT_PUBLIC_REST_BASE_API_URL

  if (token) {
    axiosConfig.headers = axiosConfig.headers || {}
    axiosConfig.headers.authorization = `Bearer ${token}`
  }
  return axiosConfig
})

let handling401 = false

request.interceptors.response.use(
  (response) => ({
    hasError: false,
    data: response?.data,
    status: response?.status,
  }),
  async (error) => {
    const status = error?.response?.status

    if (status === 401 && typeof window !== 'undefined') {
      if (!handling401) {
        handling401 = true
        try {
          logout()
          message.error('Your session expired. Please log in again.')
          if (Router.pathname !== '/login') {
            Router.replace('/login')
          }
        } finally {
          setTimeout(() => {
            handling401 = false
          }, 500)
        }
      }
      return Promise.reject({
        status,
        data: error?.response?.data,
        hasError: true,
      })
    }

    if (error?.response) {
      return Promise.reject({
        status,
        data: error.response.data,
        hasError: true,
      })
    }

    return Promise.reject(error)
  },
)

export default request
