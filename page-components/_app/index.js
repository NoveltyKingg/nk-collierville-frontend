import React, { useEffect, useState } from 'react'
import Layout from './layout'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Router from 'next/router'
import { ConfigProvider, App as AntdApp } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs'
import enUS from 'antd/locale/en_US'
import AuthenticationProvider from '@/common/AuthenticationProvider'
import ArticleProvider from '@/common/context'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const noLayoutRoutes = [
  '/login',
  '/registration',
  '/forgot-password',
  '/404',
  '/options',
  '/signup',
]

const theme = {
  token: {
    colorPrimary: '#385f43',
    colorInfo: '#385f43',
    colorSuccess: '#4bb117',
    colorError: '#ff4d4d',
    fontFamily: 'Ubuntu, sans-serif',
    zIndexPopupBase: 20000,
  },
}

export default function App({ Component, ...rest }) {
  const { pageProps, router } = rest

  const [layout, setLayout] = useState(false)

  useEffect(() => {
    const shouldHideLayout = noLayoutRoutes.some((route) =>
      router.asPath?.startsWith(route),
    )
    setLayout(!shouldHideLayout)
  }, [router.asPath])

  return (
    <StyleProvider hashPriority='high'>
      <ConfigProvider theme={theme} locale={enUS}>
        <AntdApp>
          <ArticleProvider>
            <AuthenticationProvider router={router} pageProps={pageProps}>
              <Layout pageProps={pageProps} layout={layout}>
                <Component {...pageProps} />
              </Layout>
            </AuthenticationProvider>
          </ArticleProvider>
        </AntdApp>
      </ConfigProvider>
    </StyleProvider>
  )
}
