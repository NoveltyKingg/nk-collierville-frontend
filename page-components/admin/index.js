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
import useGetBanners from './hooks/useGetBanners'
import useUploadBanner from './hooks/useUploadBanner'
import useDeleteBanners from './hooks/useDeleteBanners'
import useUpdateBannerLink from './hooks/useUpdateBannerLink'

const { Sider, Content } = Layout

const AdminPanel = () => {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const { tab } = router.query
  const [selectedKey, setSelectedKey] = useState('home-banners')

  const getUrls = (type) => {
    const urlMap = {
      'home-banners': {
        upload: '/home/uploadBanners',
        get: '/home/getBanners',
        delete: '/home/deleteBanners',
        update: 'home/uploadBannerLinks'
      },
      'clearance-banners': {
        upload: '/home/clearance/uploadBanners',
        get: '/home/clearance/getBanners',
        delete: '/home/clearance/deleteBanners',
        update: 'home/clearance/uploadBannerLinks'
      },
      'promotional-banners': {
        upload: '/home/promotions/uploadBanners',
        get: '/home/promotions/getBanners',
        delete: '/home/promotions/deleteBanners',
        update: 'home/promotions/uploadBannerLinks'
      }
    }
    return urlMap[type] || urlMap['home-banners']
  }

  const currentUrls = getUrls(selectedKey)
  
  const uploadHook = useUploadBanner(currentUrls.upload)
  const getHook = useGetBanners(currentUrls.get)
  const deleteHook = useDeleteBanners(currentUrls.delete)
  const updateHook = useUpdateBannerLink(currentUrls.update)

  const getBannerProps = () => {
    const titles = {
      'home-banners': 'Home Page Banners',
      'clearance-banners': 'Clearance Page Banners',
      'promotional-banners': 'Promotional Page Banners'
    }

    return {
      postBanners: uploadHook.postBanners,
      uploading: uploadHook.uploading,
      items: getHook.banners,
      fetchItems: getHook.fetchBanners,
      deleteBanners: deleteHook.deleteBanners,
      deleting: deleteHook.deleting,
      title: titles[selectedKey],
      updateBannerLink: updateHook.updateBannerLink,
      updating: updateHook.updating,
      loading: getHook.loading
    }
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
          <DynamicComponentLoader 
            selectedKey={selectedKey} 
            {...getBannerProps()}
          />
        </Content>
      </Layout>
    </div>
  )
}

export default AdminPanel
