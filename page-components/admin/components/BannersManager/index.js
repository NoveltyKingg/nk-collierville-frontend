import React, { useEffect, useState } from 'react'
import { Button, Input, Typography, Space, Upload, message, Card, Row, Col, Image } from 'antd'
import { DeleteOutlined, UploadOutlined, CheckOutlined } from '@ant-design/icons'
import useGetBanners from '../../hooks/useGetBanners'
import useUploadBanner from '../../hooks/useUploadBanner'
import useDeleteBanners from '../../hooks/useDeleteBanners'
import useGetClearenceBanners from '../../hooks/useGetClearenceBanners'
import useUploadClearenceBanner from '../../hooks/useUploadClearenceBanner'
import useDeleteClearenceBanners from '../../hooks/useDeleteClearenceBanners'
import useGetPromotionalBanners from '../../hooks/useGetPromotionalBanners'
import useUploadPromotionalBanner from '../../hooks/useUploadPromotionalBanner'
import useDeletePromotionalBanners from '../../hooks/useDeletePromotionalBanners'

const { Title } = Typography

const BannersManager = ({ selectedKey }) => {
  const [fileList, setFileList] = useState([])

  const isHomeBanners = selectedKey === 'home-banners'
  const isClearanceBanners = selectedKey === 'clearance-banners'

  let postBanners, uploading, getHook, deleteBanners, deleting, items, fetchItems, title

  if (isHomeBanners) {
    const uploadHook = useUploadBanner()
    const getBannersHook = useGetBanners()
    const deleteHook = useDeleteBanners()
    
    postBanners = uploadHook.postBanners
    uploading = uploadHook.uploading
    getHook = getBannersHook
    deleteBanners = deleteHook.deleteBanners
    deleting = deleteHook.deleting
    items = getHook.banners
    fetchItems = getHook.fetchBanners
    title = 'Home Page Banners'
  } else if (isClearanceBanners) {
    const uploadHook = useUploadClearenceBanner()
    const getBannersHook = useGetClearenceBanners()
    const deleteHook = useDeleteClearenceBanners()
    
    postBanners = uploadHook.postBanners
    uploading = uploadHook.uploading
    getHook = getBannersHook
    deleteBanners = deleteHook.deleteBanners
    deleting = deleteHook.deleting
    items = getHook.clearenceBanners
    fetchItems = getHook.fetchClearenceBanners
    title = 'Clearance Page Banners'
  } else {
    const uploadHook = useUploadPromotionalBanner()
    const getBannersHook = useGetPromotionalBanners()
    const deleteHook = useDeletePromotionalBanners()
    
    postBanners = uploadHook.postBanners
    uploading = uploadHook.uploading
    getHook = getBannersHook
    deleteBanners = deleteHook.deleteBanners
    deleting = deleteHook.deleting
    items = getHook.promotionalBanners
    fetchItems = getHook.fetchPromotionalBanners
    title = 'Promotional Page Banners'
  }

  const handleDeleteBannerClick = (bannerId, imageUrl) => {
    deleteBanners({ imageUrl })
      .then(() => {
        fetchItems()
      })
      .catch((error) => {
        message.error(error?.data?.message || 'Delete failed. Please try again.')
      })
  }

  useEffect(() => {
    fetchItems()
  }, [selectedKey, fetchItems])

  const handleUpload = () => {
    if (!fileList || fileList.length === 0) {
      message.error('Please select images to upload')
      return
    }

    postBanners({ files: fileList })
    fetchItems()
    setFileList([])
  }

  const uploadProps = {
    name: 'banners',
    multiple: false,
    maxCount: 1,
    fileList,
    accept: 'image/*',
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        message.error('You can only upload image files!')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!')
        return false
      }
      return false
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList)
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    }
  }

  return (
    <div className='w-full'> 
      <Card className='mb-2.5'>
        <div className='flex items-center justify-between'>
          <div>
            <Title level={3} className='m-0 text-gray-800'>
              {title}
            </Title>
            <p className='text-gray-600 mt-1 mb-0'>
              Manage your page banner images and their associated links
            </p>
          </div>
          <Space size='middle'>
            <Upload {...uploadProps}>
              <Button 
                icon={<UploadOutlined />}
                size='middle'
              >
                Upload Images
              </Button>
            </Upload>
            <Button 
              type='primary' 
              icon={<CheckOutlined />}
              size='middle'
              onClick={handleUpload}
              loading={uploading}
              disabled={!fileList || fileList.length === 0}
            >
              Submit Upload
            </Button>
          </Space>
        </div>
      </Card>

      <div className='space-y-3'>
        {items.map((item) => (
          <Card 
            key={item.id} 
            className='hover:shadow-sm transition-shadow duration-200 mb-2.5'
          >
            <Row gutter={[12, 12]} align='middle'>
              <Col xs={24} sm={6} md={4}>
                {item.image ? (
                  <Image 
                    src={item.image} 
                    alt={`Banner ${item.id}`}
                    className='w-full h-28 object-cover rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200'
                    preview={{ src: item.image }}
                  />
                ) : (
                  <div className='w-full h-28 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center'>
                    <span className='text-gray-400 text-sm'>No Image</span>
                  </div>
                )}
              </Col>
                
              <Col xs={24} sm={18} md={16}>
                <div className='space-y-3'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Banner Link
                    </label>
                    <Input
                      defaultValue={item.value}
                      placeholder={item.placeholder}
                      size='middle'
                      className='w-full'
                    />
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs text-gray-500'>
                        Image URL: {item?.image?.split('/')?.pop() || 'N/A'}
                    </span>
                  </div>
                </div>
              </Col>
                
              <Col xs={24} sm={24} md={4}>
                <div className='flex flex-col gap-2'>
                  <Button 
                    type='primary' 
                    size='middle'
                    className='w-full'
                  >
                      Update Link
                  </Button>
                  <Button 
                    danger 
                    icon={<DeleteOutlined />}
                    size='middle'
                    className='w-full'
                    loading={deleting}
                    onClick={() => handleDeleteBannerClick(item.id, item.image || '')}
                  >
                      Delete Banner
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <div className='text-center py-12'>
          <div className='text-gray-400 text-lg mb-2'>No banners found</div>
          <p className='text-gray-500'>Upload some images to get started</p>
        </div>
      )} 

    </div>
  )
}

export default BannersManager


