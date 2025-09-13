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
import DynamicComponentLoader from './components/DynamicComponentLoader'

const { Sider, Content } = Layout

const AdminPanel = () => {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const { tab } = router.query
  const [selectedKey, setSelectedKey] = useState('home-banners')

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
      children: [
        { key: 'all-products', label: 'All Products' },
      ],
    },
    { key: 'sub-categories', icon: <SettingOutlined />, label: 'Sub Categories' },
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

  return (
    <div className='flex flex-col min-h-screen'> 
      <Layout style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Sider 
          onCollapse={setCollapsed} 
          width={250}
          style={{ backgroundColor: '#385f43' }}>
          <div className='p-4 text-white text-start font-bold text-lg'>
            {collapsed ? 'AD' : 'Admin Panel'}
          </div>
          <Menu 
            theme='dark'
            mode='inline'
            items={menuItems}
            selectedKeys={[selectedKey]}
            defaultOpenKeys={['banners']}
            style={{ backgroundColor: '#385f43', color: '#fff' }}
            onClick={(info) => {
              setSelectedKey(info.key)
              router.push(`/admin?tab=${info.key}`, undefined, { shallow: true })
            }}
          />
        </Sider>
        <Content className='p-6'>
          <DynamicComponentLoader selectedKey={selectedKey} />
        </Content>
      </Layout>
    </div>
  )
}

export default AdminPanel
