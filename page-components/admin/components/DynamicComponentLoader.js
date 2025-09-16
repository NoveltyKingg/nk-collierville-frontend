import React from 'react'
import { Spin } from 'antd'
import dynamic from 'next/dynamic'

const componentMap = {
  'home-banners': dynamic(() => import('./HomeBanners'), {
    loading: () => (
      <div className='flex justify-center items-center h-64'>
        <Spin size='large' />
      </div>
    )
  }),
  'promotional-banners': dynamic(() => import('./PromotionalBanners'), {
    loading: () => (
      <div className='flex justify-center items-center h-64'>
        <Spin size='large' />
      </div>
    )
  }),
  'clearance-banners': dynamic(() => import('./ClearanceBanners'), {
    loading: () => (
      <div className='flex justify-center items-center h-64'>
        <Spin size='large' />
      </div>
    )
  }),
  'barcodes': dynamic(() => import('./Barcodes'), {
    loading: () => (
      <div className='flex justify-center items-center h-64'>
        <Spin size='large' />
      </div>
    )
  }),
  'all-products': dynamic(() => import('./AllProducts'), {
    loading: () => (
      <div className='flex justify-center items-center h-64'>
        <Spin size='large' />
      </div>
    )
  }),
  'sub-categories': dynamic(() => import('./SubCategories'), {
    loading: () => (
      <div className='flex justify-center items-center h-64'>
        <Spin size='large' />
      </div>
    )
  }),
  'varities': dynamic(() => import('./Varities'), {
    loading: () => (
      <div className='flex justify-center items-center h-64'>
        <Spin size='large' />
      </div>
    )
  }),
  'customers': dynamic(() => import('./Customers'), {
    loading: () => (
      <div className='flex justify-center items-center h-64'>
        <Spin size='large' />
      </div>
    )
  }),
  'orders': dynamic(() => import('./Orders'), {
    loading: () => (
      <div className='flex justify-center items-center h-64'>
        <Spin size='large' />
      </div>
    )
  }),
  'statements': dynamic(() => import('./Statements'), {
    loading: () => (
      <div className='flex justify-center items-center h-64'>
        <Spin size='large' />
      </div>
    )
  }),
}

const DynamicComponentLoader = ({ selectedKey, ...props }) => { 
  if (!selectedKey || !componentMap[selectedKey]) {
    return null
  }

  const DynamicComponent = componentMap[selectedKey]

  return <DynamicComponent {...props} />
}

export default DynamicComponentLoader