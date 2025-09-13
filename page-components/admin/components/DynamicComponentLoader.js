import React, { Suspense, lazy } from 'react'
import { Spin } from 'antd'

const componentMap = {
  'home-banners': () => import('./HomeBanners'),
  'promotional-banners': () => import('./PromotionalBanners'),
  'clearance-banners': () => import('./ClearanceBanners'),
  'barcodes': () => import('./Barcodes'),
  'all-products': () => import('./AllProducts'),
  'sub-categories': () => import('./SubCategories'),
  'varities': () => import('./Varities'),
  'customers': () => import('./Customers'),
  'orders': () => import('./Orders'),
  'statements': () => import('./Statements'),
}
 
const lazyComponents = Object.keys(componentMap).reduce((acc, key) => {
  acc[key] = lazy(componentMap[key])
  return acc
}, {})

const DynamicComponentLoader = ({ selectedKey, ...props }) => { 
  if (!selectedKey || !lazyComponents[selectedKey]) {
    return null
  }

  const LazyComponent = lazyComponents[selectedKey]

  return (
    <Suspense 
      fallback={
        <div className='flex justify-center items-center h-64'>
          <Spin size='large' />
        </div>
      }
    >
      <LazyComponent {...props} />
    </Suspense>
  )
}

export default DynamicComponentLoader
