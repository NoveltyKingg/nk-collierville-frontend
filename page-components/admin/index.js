import React, { useState, useEffect } from 'react'
import { Layout, Menu } from 'antd'
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  PictureOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import useGetCategories from './hooks/useGetCategory'
import formatCategories from '@/utils/format-categories'
import { MENU_OPTIONS } from './menu-options'

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
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const [data, setData] = useState([])
  const { query } = router
  const { tab } = query
  const [selectedKey, setSelectedKey] = useState('home-banners')

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
    // customers: <ListCustomers />,
    'active-orders': <ActiveOrders />,
    'previous-orders': <PreviousOrders />,
    'new-arrivals': <NewArrivals />,
    statements: <Statements />,
    barcodes: (
      <Barcodes SUBCATEGORIES={SUBCATEGORIES} CATEGORIES={CATEGORIES} />
    ),
  }

  const menuItems = [
    {
      key: 'banners',
      icon: <PictureOutlined />,
      label: 'Banners',
      children: [
        { key: 'home-banners', label: 'Home Page Banners' },
        { key: 'promotional-banners', label: 'Promotional Banners' },
        { key: 'clearance-banners', label: 'Clearence Banners' },
      ],
    },
    { key: 'barcodes', icon: <FileTextOutlined />, label: 'Bar Codes' },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: 'Products',
      children: [{ key: 'all-products', label: 'All Products' }],
    },
    {
      key: 'sub-categories',
      icon: <SettingOutlined />,
      label: 'Sub Categories',
    },
    { key: 'varities', icon: <SettingOutlined />, label: 'Varities' },
    { key: 'customers', icon: <UserOutlined />, label: 'Customers' },
    { key: 'orders', icon: <FileTextOutlined />, label: 'Orders' },
    { key: 'statements', icon: <DashboardOutlined />, label: 'Statements' },
  ]

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
    <div className='flex min-h-screen'>
      <Sider
        onCollapse={setCollapsed}
        style={{ background: '#ffffff' }}
        width={250}>
        <div className='p-4 text-start font-bold text-lg'>
          {collapsed ? 'AD' : 'Admin Panel'}
        </div>
        <Menu
          mode='inline'
          items={OPTIONS}
          selectedKeys={[selectedKey]}
          defaultOpenKeys={['banners']}
          onClick={(info) => {
            setSelectedKey(info.key)
            router.push(`/admin?tab=${info.key}`, undefined, {
              shallow: true,
            })
          }}
        />
      </Sider>
      <Content className='p-6 bg-gray-100 w-full'>{ActiveComponent}</Content>
    </div>
  )
}

export default AdminPanel
