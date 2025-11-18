import React, { useState, useEffect } from 'react'
import { FloatButton, Layout, Menu } from 'antd'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import useGetCategories from './hooks/useGetCategory'
import formatCategories from '@/utils/format-categories'
import { MENU_OPTIONS } from './menu-options'
import useIsMobile from '@/utils/useIsMobile'
import { HomeOutlined } from '@ant-design/icons'

const AddProductForm = dynamic(() => import('./products/add-product-form'))
const EditProduct = dynamic(() => import('./products/edit-product'))
const AddSubCategory = dynamic(() => import('./sub-category/add-sub-category'))
const AddVarities = dynamic(() => import('./varities'))
const EditSubCategory = dynamic(() =>
  import('./sub-category/edit-sub-category'),
)
const Banners = dynamic(() => import('./banners'))
const Barcodes = dynamic(() => import('./barcodes'))
const ActiveCustomers = dynamic(() => import('./customers/active-customers'))
const PendingCustomers = dynamic(() => import('./customers/pending-customers'))
const ActiveOrders = dynamic(() => import('./orders/order-list'))
const PreviousOrders = dynamic(() => import('./orders/previous-orders'))
const NewArrivals = dynamic(() => import('./products/new-arrivals'))
const RecentlyAdded = dynamic(() => import('./products/recently-added'))
const Statements = dynamic(() => import('./statements'))

const { Sider, Content } = Layout

const AdminPanel = () => {
  const { query, push } = useRouter()
  const [data, setData] = useState([])
  const { tab } = query
  const [selectedKey, setSelectedKey] = useState('home-banners')
  const { isMobile } = useIsMobile()

  useEffect(() => {
    if (query?.tab) {
      setSelectedKey(query?.tab)
    } else {
      setSelectedKey('add-product')
    }
  }, [])

  const { getCategories } = useGetCategories({ setData })

  const { SUBCATEGORIES, CATEGORIES, FILTERS } = formatCategories(data)

  const componentMapping = {
    'add-product': (
      <AddProductForm
        SUBCATEGORIES={SUBCATEGORIES}
        CATEGORIES={CATEGORIES}
        FILTERS={FILTERS}
      />
    ),
    'edit-product': (
      <EditProduct
        SUBCATEGORIES={SUBCATEGORIES}
        CATEGORIES={CATEGORIES}
        FILTERS={FILTERS}
      />
    ),
    'recently-added': (
      <RecentlyAdded
        CATEGORIES={CATEGORIES}
        SUBCATEGORIES={SUBCATEGORIES}
        FILTERS={FILTERS}
      />
    ),
    'add-sub-category': <AddSubCategory CATEGORIES={CATEGORIES} />,
    'edit-sub-category': (
      <EditSubCategory
        CATEGORIES={CATEGORIES}
        SUBCATEGORIES={SUBCATEGORIES}
        setData={setData}
      />
    ),
    varities: (
      <AddVarities SUBCATEGORIES={SUBCATEGORIES} CATEGORIES={CATEGORIES} />
    ),
    'home-banners': <Banners type='home' />,
    'promotional-banners': <Banners type='promotions' />,
    'clearence-banners': <Banners type='clearance' />,
    'active-customers': <ActiveCustomers />,
    'pending-customers': <PendingCustomers />,
    'active-orders': <ActiveOrders />,
    'previous-orders': <PreviousOrders />,
    'new-arrivals': <NewArrivals />,
    statements: <Statements />,
    barcodes: (
      <Barcodes SUBCATEGORIES={SUBCATEGORIES} CATEGORIES={CATEGORIES} />
    ),
  }

  useEffect(() => {
    if (tab) {
      setSelectedKey(tab)
    }
  }, [tab])

  useEffect(() => {
    getCategories()
  }, [])

  const ActiveComponent = componentMapping[selectedKey]

  const OPTIONS = MENU_OPTIONS({ customersData: [] })

  return (
    <div className='flex flex-col lg:flex-row xl:flex-row min-h-screen'>
      <div style={{ background: '#38455e' }} width={250}>
        <div className='p-4 text-start font-bold text-lg text-white'>
          ADMIN PANEL
        </div>
        <Menu
          mode={isMobile ? 'horizontal' : 'inline'}
          items={OPTIONS}
          selectedKeys={[selectedKey]}
          className='flex-1 overflow-auto !bg-[#38455e]'
          defaultOpenKeys={['banners']}
          onClick={(info) => {
            setSelectedKey(info.key)
            push(`/admin?tab=${info.key}`)
          }}
        />
      </div>
      <Content className='p-6 bg-gray-100 w-full'>{ActiveComponent}</Content>
      <FloatButton icon={<HomeOutlined />} onClick={() => push('/')} />
    </div>
  )
}

export default AdminPanel
