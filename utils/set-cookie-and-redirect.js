/* eslint-disable */
import setCookie from './set-cookie'

const setCookieAndRedirect = (token, ctx) => {
  const { res, isServer } = ctx || {}
  setCookie('nk-collierville-token', token, 2000, ctx)

  if (isServer) {
    res.redirect('/')
  } else {
    if (window.history.back) {
      window.history.back()
      return
    }
    window.location.href = '/'
  }
}

export default setCookieAndRedirect
