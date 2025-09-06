import React, { useEffect } from 'react'
import Header from './header'
import Footer from './footer'
import useGetAllWebCategories from '../hooks/useGetAllWebCategories'

const Layout = ({ children, layout }) => {
  const { getAllWebCategories } = useGetAllWebCategories()

  useEffect(() => {
    getAllWebCategories()
  }, [])

  return (
    <div className='flex flex-col min-h-screen'>
      {layout && <Header />}
      <main className='flex-grow bg-[#f5f5f5]'>{children}</main>
      {layout && <Footer />}
    </div>
  )
}

export default Layout
