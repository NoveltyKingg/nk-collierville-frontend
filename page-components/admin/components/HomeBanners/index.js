import React, { useState, useEffect } from 'react'
import { Button, Input, Typography, Space, Upload, message, Card, Row, Col, Modal, Image } from 'antd'
import { DeleteOutlined, UploadOutlined, CheckOutlined, EyeOutlined } from '@ant-design/icons'
import useUploadBanner from '../../hooks/useUploadBanner'
import useGetBanners from '../../hooks/useGetBanners'
import useDeleteBanners from '../../hooks/useDeleteBanners'

const { Title } = Typography

const HomeBanners = () => {
  const [fileList, setFileList] = useState([])
  const { postBanners, uploading } = useUploadBanner() 
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const { fetchBanners, banners, loading } = useGetBanners()
  const { deleteBanners, deleting } = useDeleteBanners()

  const handleDeleteBannerClick = (bannerId, imageUrl) => {
    deleteBanners({ imageUrl })
    fetchBanners()
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  const handleUpload = () => {
    if (!fileList || fileList.length === 0) {
      message.warning('Please select images to upload')
      return
    }

    postBanners({ files: fileList })
      .then(() => {
        fetchBanners()
        setFileList([])
      })
      .catch((error) => {
        message.error('Upload failed. Please try again.')
      })
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

  const handleImagePreview = (imageSrc) => {
    setPreviewImage(imageSrc)
    setPreviewVisible(true)
  }
 
  return (
    <div className='w-full'> 
      <Card className='mb-2.5'>
        <div className='flex items-center justify-between'>
          <div>
            <Title level={3} className='m-0 text-gray-800'>
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
              disabled={!fileList || fileList.length === 0}
            >
              Submit Upload
            </Button>
          </Space>
        </div>
      </Card>

      <div className='space-y-3'>
        {banners.map((item) => (
          <Card 
            key={item.id} 
            className='hover:shadow-sm transition-shadow duration-200 mb-2.5'
          >
            <Row gutter={[12, 12]} align='middle'>
              <Col xs={24} sm={6} md={4}>
                <div className='relative group cursor-pointer' onClick={() => item.image && handleImagePreview(item.image)}>
                  {item.image ? (
                    <Image 
                      src={item.image} 
                      alt={`Banner ${item.id}`}
                      className='w-full h-28 object-cover rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200'
                      preview={false}
                    />
                  ) : (
                    <div className='w-full h-28 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center'>
                      <span className='text-gray-400 text-sm'>No Image</span>
                    </div>
                  )}
                  <div className='absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 rounded-lg flex items-center justify-center'>
                    <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                      <EyeOutlined className='text-white text-2xl' />
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

      {banners.length === 0 && (
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
        className='top-5'
      >
        <div className='text-center'>
          <Image 
            src={previewImage} 
            alt='Banner Preview'
            className='max-w-full max-h-[70vh] object-contain mx-auto rounded-lg'
            preview={false}
          />
        </div>
      </Modal>
    </div>
  )
}

export default HomeBanners