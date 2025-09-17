import React from 'react'
import { Spin } from 'antd'
import dynamic from 'next/dynamic'

const LoadingSpinner = () => (
  <div className='flex justify-center items-center h-64'>
    <Spin size='large' />
  </div>
)

const componentMap = {
  'home-banners': dynamic(() => import('./BannersManager'), {
    loading: LoadingSpinner
  }),
  'promotional-banners': dynamic(() => import('./BannersManager'), {
    loading: LoadingSpinner
  }),
  'clearance-banners': dynamic(() => import('./BannersManager'), {
    loading: LoadingSpinner
  }),
  'barcodes': dynamic(() => import('./Barcodes'), {
    loading: LoadingSpinner
  }),
  'all-products': dynamic(() => import('./AllProducts'), {
    loading: LoadingSpinner
  }),
  'sub-categories': dynamic(() => import('./SubCategories'), {
    loading: LoadingSpinner
  }),
  'varities': dynamic(() => import('./Varities'), {
    loading: LoadingSpinner
  }),
  'customers': dynamic(() => import('./Customers'), {
    loading: LoadingSpinner
  }),
  'orders': dynamic(() => import('./Orders'), {
    loading: LoadingSpinner
  }),
  'statements': dynamic(() => import('./Statements'), {
    loading: LoadingSpinner
  }),
}

const DynamicComponentLoader = ({ selectedKey, ...props }) => { 
  if (!selectedKey || !componentMap[selectedKey]) {
    return null
  }

  const DynamicComponent = componentMap[selectedKey]

  return <DynamicComponent selectedKey={selectedKey} {...props} />
}

export default DynamicComponentLoader