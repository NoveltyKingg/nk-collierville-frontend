import React, { useEffect, useMemo, useRef, useState } from 'react'
import useRequest from '@/request'
import useGetContext from '../context/useGetContext'
import { getCookie } from '@/utils/get-cookie'

const PRIVATE_TEMPLATES = [
  '/[store_id]/cart',
  '/[store_id]/checkout',
  '/[store_id]/profile',
  '/admin',
]

const UNAUTH_TEMPLATES = ['/login', '/signup']

function templateToRegex(template) {
  if (template.startsWith('/[')) {
    const re = template.replace('/[store_id]', '/[^/]+').replace(/\/$/, '')
    return new RegExp(`^${re}(?:\\/)?$`)
  }
  if (template === '/admin') {
    return /^\/admin(?:\/.*)?$/
  }
  const re = template.replace(/\/$/, '')
  return new RegExp(`^${re}(?:\\/)?$`)
}

const PRIVATE_REGEXES = PRIVATE_TEMPLATES.map(templateToRegex)
const UNAUTH_REGEXES = UNAUTH_TEMPLATES.map(templateToRegex)

const matches = (pathname, regexes) => regexes.some((re) => re.test(pathname))

export default function AuthenticationProvider({ children, router }) {
  const context = useGetContext()
  const mounted = useRef(true)

  const profileAPI = useRequest(
    { method: 'GET', url: '/auth/token-payload' },
    { manual: true },
  )

  const pathname = router?.pathname || ''

  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [role, setRole] = useState(null)

  const token = useMemo(() => getCookie('nk-collierville-token'), [pathname])

  useEffect(() => {
    mounted.current = true
    const run = async () => {
      setIsLoading(true)
      try {
        if (!token) {
          setIsLoggedIn(false)
          setRole(null)
          return
        }
        const [, trigger] = profileAPI
        const resp = await trigger()

        const profile = resp?.data || {}
        if (!profile || Object.keys(profile).length === 0) {
          setIsLoggedIn(false)
          setRole(null)
          return
        }

        if (resp.status === 200 && profile.status === 'PENDING_REGISTRATION') {
          router.replace('/registration')
        }

        const { dispatchData, AVAILABLE_ACTIONS } = context || {}
        dispatchData?.(AVAILABLE_ACTIONS?.ADD_PROFILE, {
          ...profile,
          isLoggedIn: true,
        })

        setIsLoggedIn(true)
        setRole(profile?.status || null)
      } catch {
        setIsLoggedIn(false)
        setRole(null)
      } finally {
        if (mounted.current) setIsLoading(false)
      }
    }
    run()
    return () => {
      mounted.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // 3) Redirect logic — ONLY in effects
  useEffect(() => {
    if (isLoading) return
    if (!pathname) return

    if (!isLoggedIn) {
      // If trying to hit admin (or any private area) without login
      if (
        /^\/admin(?:\/.*)?$/.test(pathname) ||
        matches(pathname, PRIVATE_REGEXES)
      ) {
        router.replace('/login')
        return
      }
      return
    }

    // Authenticated: keep users away from unauth routes like /login
    if (matches(pathname, UNAUTH_REGEXES)) {
      router.replace('/')
      return
    }

    // Authenticated: non-admin tries to enter /admin
    if (role !== 'ADMIN' && /^\/admin(?:\/.*)?$/.test(pathname)) {
      router.replace('/')
    }
  }, [isLoading, isLoggedIn, role, router])

  // Optional: splash while checking
  if (isLoading) return null

  return children
}
