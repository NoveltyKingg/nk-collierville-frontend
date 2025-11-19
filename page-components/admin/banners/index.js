import React, { useEffect, useState } from 'react'
import {
  Button,
  Card,
  Empty,
  Image,
  Input,
  Upload,
  Typography,
  Space,
  Divider,
  message,
  Popconfirm,
  Skeleton,
  Modal,
} from 'antd'
import {
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  LinkOutlined,
  EyeOutlined,
} from '@ant-design/icons'

import useGetBanners from '../hooks/useGetBanners'
import useAddBanners from '../hooks/useAddBanners'
import useDeleteBanners from '../hooks/useDeleteBanners'
import useUpdateBannerLink from '../hooks/useUpdateBannerLink'
import DeleteModal from '@/components/delete-modal'
import { dummyRequest } from '@/utils/dummyRequest'
import useIsMobile from '@/utils/useIsMobile'

const { Title, Text } = Typography

function Banners({ type }) {
  const normalizedType = type === 'home' ? '' : type
  const [fileList, setFileList] = useState([])
  const [deleteImage, setDeleteImage] = useState(null)
  const [links, setLinks] = useState({})
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewSrc, setPreviewSrc] = useState('')
  const [previewTitle, setPreviewTitle] = useState('Preview')

  const { isMobile } = useIsMobile()
  const {
    data,
    getBanners,
    loading: fetching,
  } = useGetBanners({ type: normalizedType })
  const { addBanners, loading: submitting } = useAddBanners({
    type: normalizedType,
    getBanners,
  })
  const { deleteBanners, loading: deleting } = useDeleteBanners({
    type: normalizedType,
    getBanners,
  })
  const { updateBannersLink, updateLoading } = useUpdateBannerLink({
    type: normalizedType,
  })

  useEffect(() => {
    getBanners()
  }, [type]) // eslint-disable-line react-hooks/exhaustive-deps

  const pageTitle = `${type?.charAt(0).toUpperCase() + type?.slice(1)} Banners`

  useEffect(() => {
    const uploaded = Object.entries(data || {}).map(([url, value], idx) => ({
      uid: `existing-${idx}`,
      name: url.split('/').pop(),
      status: 'done',
      url,
      value,
    }))
    setFileList(uploaded)
    setLinks(
      uploaded.reduce((acc, it) => ((acc[it.url] = it.value || ''), acc), {}),
    )
  }, [data])

  const handleChange = ({ fileList: fl }) => setFileList(fl)

  const handleSubmit = async () => {
    if (!fileList?.some((f) => f.originFileObj || f.url)) {
      message.info('Please add at least one banner.')
      return
    }
    const formData = new FormData()
    fileList.forEach((f) => {
      formData.append('banners', f?.url ? f.url : f?.originFileObj)
    })
    addBanners({ formData })
  }

  const handleUpdateLink = (file) => {
    const url = file?.url
    const next = links[url] || ''
    updateBannersLink({ updateData: { [url]: next } })
  }

  const onRemoveAsk = (file) => setDeleteImage(file)
  const handleCancelDelete = () => setDeleteImage(null)
  const handleConfirmDelete = () => {
    if (!deleteImage?.url) return
    deleteBanners({ deletedData: [deleteImage.url] })
    setDeleteImage(null)
  }

  const handleLinkChange = (url, e) => {
    setLinks((prev) => ({ ...prev, [url]: e.target.value }))
  }

  const refresh = () => getBanners()
  const canAddMore = (fileList?.length || 0) < 10

  const fileToSrc = async (file) => {
    if (file.url) return file.url
    if (file.thumbUrl) return file.thumbUrl
    if (file.originFileObj) {
      return URL.createObjectURL(file.originFileObj)
    }
    return ''
  }

  const handlePreview = async (file) => {
    const src = await fileToSrc(file)
    if (!src) return
    setPreviewSrc(src)
    setPreviewTitle(file.name || 'Preview')
    setPreviewOpen(true)
  }

  const removeLocal = (file) => {
    setFileList((prev) =>
      prev.filter((f) => (f.uid || f.url) !== (file.uid || file.url)),
    )
    if (
      file.originFileObj &&
      file.preview &&
      file.preview.startsWith('blob:')
    ) {
      try {
        URL.revokeObjectURL(file.preview)
      } catch {}
    }
  }

  return (
    <div className='space-y-6 gap-2'>
      <div className='flex items-center justify-between'>
        <div>
          <Title level={3} className='!m-0'>
            {pageTitle}
          </Title>
          <Text type='secondary'>
            Upload banners, set target links, and remove outdated images
          </Text>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={refresh}
            loading={fetching}>
            Refresh
          </Button>
          <Button type='primary' onClick={handleSubmit} loading={submitting}>
            Save Changes
          </Button>
        </Space>
      </div>

      <Card className='rounded-2xl shadow-sm'>
        <Divider orientation='left'>Upload</Divider>
        <Upload
          listType='picture-card'
          multiple
          maxCount={10}
          customRequest={dummyRequest}
          fileList={fileList}
          onChange={handleChange}
          showUploadList={false}
          onPreview={handlePreview}>
          {canAddMore ? (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Add Banner</div>
            </div>
          ) : null}
        </Upload>
        <Text type='secondary'>
          Recommended size: use consistent aspect ratios for a clean carousel.
        </Text>
      </Card>
      <Card className='rounded-2xl shadow-sm'>
        <Divider orientation='left'>Current Banners</Divider>

        {fetching ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : !fileList?.length ? (
          <Empty description='No banners yet' />
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16'>
            {fileList.map((file) => {
              const isExisting = !!file.url
              return (
                <div key={file.uid || file.url} className=''>
                  <div className='relative rounded-xl overflow-hidden border border-[#cdcdcd]'>
                    <Image
                      src={file.url || file.thumbUrl || ''}
                      alt={file.name}
                      width='100%'
                      height={isMobile ? 160 : 220}
                      style={{ objectFit: 'cover', cursor: 'pointer' }}
                      preview={false}
                      onClick={() => handlePreview(file)}
                    />
                    <div className='absolute top-2 right-2 flex gap-2'>
                      <Button
                        size='small'
                        icon={<EyeOutlined />}
                        onClick={() => handlePreview(file)}>
                        Preview
                      </Button>
                      {isExisting ? (
                        <Popconfirm
                          title='Delete banner'
                          description='Are you sure you want to remove this banner?'
                          okText='Delete'
                          okButtonProps={{ danger: true, loading: deleting }}
                          onConfirm={() => onRemoveAsk(file)}>
                          <Button
                            size='small'
                            danger
                            icon={<DeleteOutlined />}
                          />
                        </Popconfirm>
                      ) : (
                        <Button
                          size='small'
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeLocal(file)}
                        />
                      )}
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Text type='secondary' className='block'>
                      Link
                    </Text>
                    <Input
                      prefix={<LinkOutlined />}
                      placeholder='https://example.com/target'
                      value={links[file?.url] || ''}
                      onChange={(e) => handleLinkChange(file?.url, e)}
                      disabled={!isExisting}
                    />
                    {isExisting && (
                      <div className='flex items-center justify-between'>
                        <Button
                          onClick={() => handleUpdateLink(file)}
                          loading={updateLoading}>
                          Update Link
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {deleteImage && (
        <DeleteModal
          open={!!deleteImage}
          setOpen={setDeleteImage}
          data={deleteImage}
          handleCancel={handleCancelDelete}
          handleDelete={handleConfirmDelete}
        />
      )}

      <Modal
        open={previewOpen}
        footer={null}
        title={previewTitle}
        onCancel={() => setPreviewOpen(false)}
        width={isMobile ? 360 : 720}>
        <div className='w-full'>
          <Image
            src={previewSrc}
            alt={previewTitle}
            preview={false}
            style={{ width: '100%', borderRadius: 8 }}
          />
        </div>
      </Modal>
    </div>
  )
}

export default Banners
