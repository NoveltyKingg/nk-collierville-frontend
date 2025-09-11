import React, { useMemo, useState, useEffect } from 'react'
import { Button, Input, Typography, Space, Upload, message, Card, Row, Col, Modal } from 'antd'
import { DeleteOutlined, UploadOutlined, CheckOutlined, EyeOutlined } from '@ant-design/icons'
import usePostUploadBanner from '@/page-components/admin/hooks/usePostUploadBanner'
import useDeleteBanners from '@/page-components/admin/hooks/useDeleteBanners'
import useRequest from '@/request'

const { Title } = Typography

const HomeBanners = () => {
  const [fileList, setFileList] = useState([])
  const [uploadingLocal, setUploadingLocal] = useState(false)
  const { postBanners, uploading } = usePostUploadBanner() 
  const [banners, setBanners] = useState([])
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const bannerItems = banners

  const [{ data, loading }, trigger] = useRequest({ method: 'GET', url: '/home/getBanners' }, { manual: true })
  
  const { deleteBanners, deleting } = useDeleteBanners()
  
  const fetchBanners = async () => {
    try {
      const res = await trigger()
      const bannerData = res?.data || {}
      
      const bannerList = Object.entries(bannerData).map(([imageUrl, linkUrl], index) => ({
        id: imageUrl,
        image: imageUrl,
        placeholder: 'Enter the link',
        value: linkUrl || ''
      }))
      
      setBanners(bannerList)
    } catch (e) {
      if (e.name !== 'CanceledError' && e.message !== 'canceled') {
        console.error('Failed to fetch banners:', e)
      }
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('Please select images to upload')
      return
    }

    setUploadingLocal(true)
    
    try {
      const ok = await postBanners({ files: fileList })
      if (ok) {
        fetchBanners()
        setFileList([])
      }
    } catch (error) {
      message.error('Upload failed. Please try again.')
    } finally {
      setUploadingLocal(false)
    }
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
        message.error('Image must smaller than 2MB!')
        return false
      }
      
      return false
    },
    onChange: ({ fileList: fl }) => {
      setFileList(fl.slice(-1))
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    }
  }

  const handleImagePreview = (imageSrc) => {
    setPreviewImage(imageSrc)
    setPreviewVisible(true)
  }

  const handleDeleteBanner = async (bannerId, imageUrl) => {
    console.log('Delete button clicked:', { bannerId, imageUrl })
    
    try {
      setDeletingId(bannerId)
      console.log('Calling deleteBanners with:', { imageUrl })
      
      const ok = await deleteBanners({ imageUrl })
      console.log('Delete result:', ok)
      
      if (ok) {
        message.success('Banner deleted successfully!')
        setBanners(prev => prev.filter(b => b.id !== bannerId))
        fetchBanners()
      } else {
        message.error('Failed to delete banner')
      }
    } catch (error) {
      console.error('Delete error:', error)
      message.error(error?.data?.message || 'Failed to delete banner')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className='w-full'> 
      <Card style={{ marginBottom: '10px' }}>
        <div className='flex items-center justify-between'>
          <div>
            <Title level={3} style={{ margin: 0, color: '#1f2937' }}>
              Home Page Banners
            </Title>
            <p className='text-gray-600 mt-1 mb-0'>
              Manage your home page banner images and their associated links
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
              disabled={fileList.length === 0}
            >
              Submit Upload
            </Button>
          </Space>
        </div>
      </Card>
 
      <div className='space-y-3'>
        {bannerItems.map((item) => (
          <Card 
            key={item.id} 
            className='hover:shadow-sm transition-shadow duration-200'
            style={{ marginBottom: '10px' }}
          >
            <Row gutter={[12, 12]} align='middle'>
              <Col xs={24} sm={6} md={4}>
                <div className='relative group cursor-pointer' onClick={() => handleImagePreview(item.image)}>
                  <img 
                    src={item.image} 
                    alt={`Banner ${item.id}`}
                    className='w-full h-28 object-cover rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200'
                  />
                  <div className='absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 rounded-lg flex items-center justify-center'>
                    <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                      <EyeOutlined className='text-white text-2xl' />
                      <div className='text-white text-sm mt-1 font-medium'>Preview</div>
                    </div>
                  </div>
                </div>
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
                        Image URL: {item.image.split('/').pop()}
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
                    loading={deletingId === item.id}
                    onClick={() => handleDeleteBanner(item.id, item.image)}
                  >
                      Delete Banner
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
        ))}
      </div>

      {bannerItems.length === 0 && (
        <div className='text-center py-12'>
          <div className='text-gray-400 text-lg mb-2'>No banners found</div>
          <p className='text-gray-500'>Upload some images to get started</p>
        </div>
      )} 
 
      <Modal
        open={previewVisible}
        title='Banner Preview'
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width='80%'
        style={{ top: 20 }}
      >
        <div className='text-center'>
          <img 
            src={previewImage} 
            alt='Banner Preview'
            className='max-w-full max-h-[70vh] object-contain mx-auto rounded-lg'
          />
        </div>
      </Modal>
    </div>
  )
}

export default HomeBanners
