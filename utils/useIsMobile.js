import { useEffect, useState } from 'react'

const MOBILE_QUERY = '(max-width: 1048px)'

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia(MOBILE_QUERY)
    setIsMobile(mql.matches)
    const onChange = (e) => setIsMobile(e.matches)
    if (mql.addEventListener) mql.addEventListener('change', onChange)
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange)
    }
  }, [])

  return { isMobile }
}

export default useIsMobile
