import React, { useEffect, useState } from 'react'
import useGetCategories from './hooks/useGetCategory'
import formatCategories from '@/utils/format-categories'
import AddProductForm from './products/add-product-form'
import NewArrivals from './products/new-arrivals'

const AdminPanel = () => {
  const [data, setData] = useState()
  const { getCategories } = useGetCategories({ setData })

  const { SUBCATEGORIES, CATEGORIES } = formatCategories(data || [])

  useEffect(() => {
    getCategories()
  }, [])

  return (
    <div>
      <NewArrivals SUBCATEGORIES={SUBCATEGORIES} CATEGORIES={CATEGORIES} />
    </div>
  )
}

export default AdminPanel
