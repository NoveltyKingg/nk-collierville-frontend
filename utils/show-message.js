import { App } from 'antd'

export default function useToast() {
  const { message } = App.useApp()

  const show = (content, type = 'info', duration = 2) => {
    const map = {
      info: () => message.info(content, duration),
      success: () => message.success(content, duration),
      warning: () => message.warning(content, duration),
      warn: () => message.warning(content, duration),
      error: () => message.error(content, duration),
      loading: () => message.loading(content, duration), // duration=0 => persistent
    }
    return (map[type] || map.error)()
  }

  // Handy helpers
  const info = (c, d = 2) => message.info(c, d)
  const success = (c, d = 2) => message.success(c, d)
  const warning = (c, d = 2) => message.warning(c, d)
  const error = (c, d = 2) => message.error(c, d)

  // Persistent loading -> returns a hide() fn you must call
  const loadingMessage = (c = 'Loading...') => message.loading(c, 0)

  return { show, info, success, warning, error, loadingMessage }
}
