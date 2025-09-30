import React, { useEffect, useState } from 'react'
import { Button, Input, Typography, Space, Upload, message, Row, Col, Image, Modal, Checkbox } from 'antd'
import { DeleteOutlined, UploadOutlined, CheckOutlined } from '@ant-design/icons'

const { Title } = Typography

const BannersManager = ({ 
  selectedKey, 
  postBanners, 
  uploading, 
  items, 
  fetchItems, 
  deleteBanners, 
  deleting, 
  title, 
  updateBannerLink, 
  updating,
  loading
}) => {
  const [fileList, setFileList] = useState([])
  const [linkInputs, setLinkInputs] = useState({})
  const [deleteModal, setDeleteModal] = useState({ visible: false, imageUrl: null })
  const [selectedBanners, setSelectedBanners] = useState([])
  const [bulkDeleteModal, setBulkDeleteModal] = useState({ visible: false })
  const [updatingItems, setUpdatingItems] = useState(new Set())
  const [deletingItems, setDeletingItems] = useState(new Set())

  const handleDeleteBannerClick = (imageUrl) => {
    setDeleteModal({ visible: true, imageUrl })
  }

  const handleDeleteConfirm = async () => {
    if (deleteModal.imageUrl) {
      setDeletingItems(prev => new Set(prev).add(deleteModal.imageUrl))
      
      try {
        await deleteBanners({ imageUrl: deleteModal.imageUrl })
        fetchItems()
      } catch (error) {
        console.error('Delete failed:', error)
      } finally {
        setDeletingItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(deleteModal.imageUrl)
          return newSet
        })
      }
    }
    setDeleteModal({ visible: false, imageUrl: null })
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ visible: false, imageUrl: null })
  }

  const handleBannerSelect = (imageUrl, checked) => {
    if (checked) {
      setSelectedBanners(prev => [...prev, imageUrl])
    } else {
      setSelectedBanners(prev => prev.filter(url => url !== imageUrl))
    }
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedBanners(items?.map(item => item.image) || [])
    } else {
      setSelectedBanners([])
    }
  }

  const handleBulkDelete = () => {
    if (selectedBanners.length === 0) {
      message.warning('Please select banners to delete')
      return
    }
    setBulkDeleteModal({ visible: true })
  }

  const handleBulkDeleteConfirm = async () => {
    if (selectedBanners.length > 0) {
      setDeletingItems(prev => {
        const newSet = new Set(prev)
        selectedBanners.forEach(url => newSet.add(url))
        return newSet
      })
      
      try {
        await deleteBanners({ imageUrls: selectedBanners })
        setSelectedBanners([])
        fetchItems()
      } catch (error) {
        console.error('Bulk delete failed:', error)
      } finally {
        setDeletingItems(prev => {
          const newSet = new Set(prev)
          selectedBanners.forEach(url => newSet.delete(url))
          return newSet
        })
      }
    }
    setBulkDeleteModal({ visible: false })
  }

  const handleBulkDeleteCancel = () => {
    setBulkDeleteModal({ visible: false })
  }

  const handleLinkChange = (imageUrl, value) => {
    setLinkInputs(prev => ({
      ...prev,
      [imageUrl]: value
    }))
  }

  const handleUpdateLink = async (imageUrl, itemId) => {
    const linkUrl = linkInputs[itemId] || ''
    
    setUpdatingItems(prev => new Set(prev).add(itemId))
    
    try {
      await updateBannerLink({ imageUrl, linkUrl })
    } catch (error) {
      console.error('Update failed:', error)
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  useEffect(() => {
    fetchItems()
  }, [selectedKey])

  const handleUpload = async () => {
    if (!fileList || fileList.length === 0) {
      message.error('Please select images to upload')
      return
    }

    try {
      await postBanners({ files: fileList })  
      setTimeout(() => {
        fetchItems()
      }, 500)
      setFileList([])
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const uploadProps = {
    name: 'banners',
    multiple: false,
    maxCount: 1,
    fileList,
    accept: 'image/*',
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        message.error('You can only upload image files!')
        return false
      }
      const isLt9M = file.size / 1024 / 1024 < 9
      if (!isLt9M) {
        message.error('Image must be smaller than 9MB!')
        return false
      }
      return true
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList)
    }
  }

  return (
    <div className='w-full'> 
      <div className='mb-2.5 p-4'>
        <div className='flex items-center justify-between'>
          <div>
            <Title level={3} className='m-0 text-gray-800'>
              {title}
            </Title>
            <p className='text-gray-600 mt-1 mb-0'>
              Manage your page banner images and their associated links
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {fileList && fileList.length > 0 && (
              <div className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg bg-gray-50">
                <img 
                  src={fileList[0].thumbUrl || fileList[0].url || URL.createObjectURL(fileList[0].originFileObj || fileList[0])} 
                  alt={fileList[0].name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{fileList[0].name}</p>
                  <p className="text-xs text-gray-500">
                    {(fileList[0].size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button 
                  type="text" 
                  danger 
                  size="small"
                  onClick={() => setFileList([])}
                  icon={<DeleteOutlined />}
                />
              </div>
            )}
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
        </div>
         
        {items && items.length > 0 && (
          <div className='mt-4 p-3 bg-gray-50 rounded-lg'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <Checkbox
                  checked={selectedBanners.length === items.length && items.length > 0}
                  indeterminate={selectedBanners.length > 0 && selectedBanners.length < items.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                >
                  Select All ({selectedBanners.length}/{items.length})
                </Checkbox>
                {selectedBanners.length > 0 && (
                  <span className='text-sm text-gray-600'>
                    {selectedBanners.length} banner(s) selected
                  </span>
                )}
              </div>
              {selectedBanners.length > 0 && (
                <Button 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={handleBulkDelete}
                  loading={selectedBanners.some(url => deletingItems.has(url))}
                >
                  Delete Selected ({selectedBanners.length})
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className='flex flex-col justify-center items-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4'></div>
          <p className='text-gray-600 font-medium'>Loading banners...</p>
        </div>
      ) : (
        <>
          <div className='space-y-3'>
            {items && items.length > 0 ? items.map((item) => (
            <div 
              key={item.id} 
              className='hover:shadow-sm transition-shadow duration-200 mb-2.5 p-4 border border-gray-200'
            >
              <Row gutter={[12, 12]} align='middle'>
                <Col xs={2} sm={1} md={1}>
                  <Checkbox
                    checked={selectedBanners.includes(item.image)}
                    onChange={(e) => handleBannerSelect(item.image, e.target.checked)}
                  />
                </Col>
                <Col xs={22} sm={5} md={3}>
                  {item.image ? (
                    <Image 
                      src={item.image} 
                      alt={`Banner ${item.id}`}
                      className='w-full h-28 object-cover rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200'
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
                        value={linkInputs[item.id] !== undefined ? linkInputs[item.id] : (item.linkUrl || '')}
                        onChange={(e) => handleLinkChange(item.id, e.target.value)}
                        placeholder={'Enter the link'}
                        size='middle'
                        className='w-full'
                      />
                    </div>
                  </div>
                </Col>
                  
                <Col xs={24} sm={24} md={4}>
                  <div className='flex flex-col gap-2'>
                    <Button 
                      type='primary' 
                      size='middle'
                      className='w-full'
                      loading={updatingItems.has(item.id)}
                      onClick={() => handleUpdateLink(item.image, item.id)}
                    >
                        Update Link
                    </Button>
                    <Button 
                      danger 
                      icon={<DeleteOutlined />}
                      size='middle'
                      className='w-full'
                      loading={deletingItems.has(item.image)}
                      onClick={() => handleDeleteBannerClick(item.image)}
                    >
                        Delete Banner
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
            )) : null}
          </div>

          {(!items || items.length === 0) && (
            <div className='text-center py-12'>
              <div className='text-gray-400 text-lg mb-2'>No banners found</div>
              <p className='text-gray-500'>Upload some images to get started</p>
            </div>
          )}
        </>
      )}

      <Modal
        title="Delete Banner"
        open={deleteModal.visible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Yes, Delete"
        cancelText="Cancel"
        okType="danger"
        confirmLoading={deleting}
      >
        <p>Are you sure you want to delete this banner? This action cannot be undone.</p>
      </Modal>

      <Modal
        title="Delete Multiple Banners"
        open={bulkDeleteModal.visible}
        onOk={handleBulkDeleteConfirm}
        onCancel={handleBulkDeleteCancel}
        okText="Yes, Delete All"
        cancelText="Cancel"
        okType="danger"
        confirmLoading={deleting}
      >
        <p>Are you sure you want to delete {selectedBanners.length} selected banner(s)? This action cannot be undone.</p>
      </Modal>

    </div>
  )
}

export default BannersManager


