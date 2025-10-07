/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Collapse,
  Divider,
  Empty,
  Image,
  Space,
  Tag,
  Tooltip,
  Typography,
  Skeleton,
} from 'antd'
import {
  CaretRightOutlined,
  EditOutlined,
  ReloadOutlined,
} from '@ant-design/icons'

import useGetRecentlyAdded from '../../hooks/useGetRecentlyAdded'
import AddProductForm from '../add-product-form'

const { Title, Text } = Typography

function RecentlyAdded({ SUBCATEGORIES, CATEGORIES, FILTERS }) {
  const { getRecentlyAdded, recentlyAddedData } = useGetRecentlyAdded()
  const [disabled, setDisabled] = useState({})
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    getRecentlyAdded()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleEdit = (item) =>
    setDisabled((prev) => ({ ...prev, [item?.id]: !prev[item?.id] }))

  const statusTag = (isActive) =>
    isActive ? <Tag color='green'>ACTIVE</Tag> : <Tag>INACTIVE</Tag>

  const items = useMemo(() => {
    if (!recentlyAddedData) return []
    return recentlyAddedData.map((item) => ({
      key: item?.id,
      label: (
        <div className='flex items-center justify-between gap-3 w-full'>
          <div className='flex items-center gap-3 min-w-0'>
            <div className='w-[40px] h-[40px] rounded-md overflow-hidden bg-[#f5f5f5] grid place-items-center'>
              {item?.imageUrls?.[0] ? (
                <Image
                  src={item.imageUrls[0]}
                  alt={item?.name || 'Product'}
                  width={40}
                  height={40}
                  preview={false}
                />
              ) : (
                <div className='w-[32px] h-[32px] bg-[#eee] rounded' />
              )}
            </div>
            <div className='min-w-0'>
              <div className='font-medium truncate'>{item?.name || '—'}</div>
              <div className='text-xs text-slate-500 truncate'>
                ID: {item?.id}
              </div>
            </div>
          </div>
          <Space size='small' wrap>
            {statusTag(item?.active)}
            <Tooltip title='Edit'>
              <Button
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleEdit(item)
                }}
              />
            </Tooltip>
          </Space>
        </div>
      ),
      children: (
        <div className='pt-2'>
          <AddProductForm
            SUBCATEGORIES={SUBCATEGORIES}
            CATEGORIES={CATEGORIES}
            FILTERS={FILTERS}
            productDetails={item}
            disabled={
              disabled[item?.id] !== undefined ? !disabled[item?.id] : true
            }
            setDisabled={setDisabled}
            subCategoryId={item?.subCategoryId}
          />
        </div>
      ),
    }))
  }, [recentlyAddedData, disabled, SUBCATEGORIES, CATEGORIES, FILTERS])

  const refresh = async () => {
    setRefreshing(true)
    try {
      await getRecentlyAdded()
    } finally {
      setRefreshing(false)
    }
  }

  const collapseProps = {
    bordered: false,
    expandIcon: ({ isActive }) => (
      <CaretRightOutlined rotate={isActive ? 90 : 0} />
    ),
    className:
      'bg-white [&_.ant-collapse-item]:rounded-lg [&_.ant-collapse-item]:overflow-hidden',
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <Title level={3} className='!m-0'>
            Recently Added
          </Title>
          <Text type='secondary'>
            Quick edits for the most recently created products
          </Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={refresh}
          loading={refreshing}>
          Refresh
        </Button>
      </div>

      <Card className='rounded-2xl shadow-sm'>
        <Divider className='!my-3' />
        {!recentlyAddedData ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : !items.length ? (
          <Empty description='No recently added products' />
        ) : (
          <Collapse
            items={items}
            defaultActiveKey={[items[0]?.key]}
            {...collapseProps}
          />
        )}
      </Card>
    </div>
  )
}

export default RecentlyAdded
