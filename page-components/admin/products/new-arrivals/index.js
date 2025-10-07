import React, { useMemo, useState } from 'react'
import {
  Button,
  Card,
  Checkbox,
  Empty,
  Image,
  List,
  Skeleton,
  Space,
  Typography,
  Divider,
  message,
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons'
import DebounceSelect from '@/components/debounce-select'
import useGetNewArrivals from '../../hooks/useGetNewArrivals'
import useUpdateNewArrivals from '../../hooks/useUpdateNewArrivals'
import useRemoveArrivals from '../../hooks/useRemoveArrivals'
import useQuerySearch from '../../hooks/useQuerySearch'

const { Title, Text } = Typography

function NewArrivals() {
  const [search, setSearch] = useState([])
  const [addedArrivals, setAddedArrivals] = useState([])
  const [deletedArrivals, setDeletedArrivals] = useState([])

  const { data } = useGetNewArrivals()
  const { queryTrigger } = useQuerySearch()
  const {
    updateNewArrivals,
    updatedData,
    loading: adding,
  } = useUpdateNewArrivals()
  const { removeArrivals, removedData, loading: removing } = useRemoveArrivals()

  const list = updatedData || removedData || data || []

  const selectedCount = deletedArrivals.length
  const queuedCount = addedArrivals.length

  const allIds = useMemo(() => list.map((i) => i?.id).filter(Boolean), [list])
  const allChecked = useMemo(
    () => allIds.length > 0 && deletedArrivals.length === allIds.length,
    [allIds, deletedArrivals],
  )
  const indeterminate =
    deletedArrivals.length > 0 && deletedArrivals.length < allIds.length

  const handleSelect = (val) => {
    setAddedArrivals((prev) => Array.from(new Set([...prev, val])))
  }

  const handleDeselect = (val) => {
    setAddedArrivals((prev) => prev.filter((v) => v !== val))
  }

  const handleAddArrivals = async () => {
    if (!queuedCount) {
      message.info('No items selected to add.')
      return
    }
    updateNewArrivals({ newArrivals: addedArrivals })
    setAddedArrivals([])
    setSearch([])
  }

  const handleCheckbox = (e) => {
    const { checked, value } = e.target
    setDeletedArrivals((prev) =>
      checked
        ? Array.from(new Set([...prev, value]))
        : prev.filter((v) => v !== value),
    )
  }

  const handleRemoveArrivals = () => {
    if (!selectedCount) {
      message.info('Select at least one product to remove.')
      return
    }
    removeArrivals({ removedData: deletedArrivals })
    setDeletedArrivals([])
  }

  const handleToggleAll = (checked) => {
    setDeletedArrivals(checked ? allIds : [])
  }

  const refreshSelected = () => {
    message.success('List refreshed')
  }

  return (
    <div className='space-y-6 p-4'>
      <div>
        <Title level={3} className='!m-0'>
          New Arrivals
        </Title>
        <Text type='secondary'>
          Manage products highlighted as “New Arrivals”
        </Text>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 items-start'>
        <DebounceSelect
          value={search}
          showSearch
          placeholder='Search products'
          optionRoute='/product'
          enterRoute='/products'
          fetchOptions={queryTrigger}
          mode='multiple'
          handleSelect={handleSelect}
          handleDeselect={handleDeselect}
          onChange={(vals) => setSearch(vals)}
          style={{ width: '100%' }}
        />
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={handleAddArrivals}
          disabled={!queuedCount}
          loading={adding}>
          Add {queuedCount ? `(${queuedCount})` : ''}
        </Button>
      </div>

      <Card className='rounded-2xl shadow-sm'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <Checkbox
              indeterminate={indeterminate}
              checked={allChecked}
              onChange={(e) => handleToggleAll(e.target.checked)}>
              Select all
            </Checkbox>
            <TagLike count={selectedCount} label='selected' />
          </div>
          <Space wrap>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleRemoveArrivals}
              disabled={!selectedCount}
              loading={removing}>
              Remove Selected
            </Button>
          </Space>
        </div>

        <Divider className='!my-3' />

        {!list || list.length === 0 ? (
          <Empty description='No new arrivals yet' />
        ) : (
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
            dataSource={list}
            renderItem={(item) => (
              <List.Item key={item?.id}>
                <Card className='rounded-xl'>
                  <div className='flex items-center gap-3'>
                    <Checkbox
                      value={item?.id}
                      onChange={handleCheckbox}
                      checked={deletedArrivals.includes(item?.id)}
                    />
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2'>
                        <div className='w-[48px] h-[48px] rounded-lg overflow-hidden bg-[#f5f5f5] grid place-items-center'>
                          {item?.imageUrls?.[0] ? (
                            <Image
                              src={item?.imageUrls[0]}
                              width={48}
                              height={48}
                              alt={item?.name || 'Product'}
                              preview={false}
                            />
                          ) : (
                            <Skeleton.Avatar
                              size='large'
                              shape='square'
                              active
                            />
                          )}
                        </div>
                        <div className='min-w-0'>
                          <div className='font-medium truncate'>
                            {item?.name || '—'}
                          </div>
                          <div className='text-xs text-slate-500 truncate'>
                            ID: {item?.id}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  )
}

function TagLike({ count, label }) {
  return (
    <span className='inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-slate-600'>
      <CheckSquareOutlined style={{ fontSize: 12, marginRight: 6 }} />
      {count} {label}
    </span>
  )
}

export default NewArrivals
