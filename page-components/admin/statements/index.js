import React, { useMemo, useState } from 'react'
import {
  Button,
  Card,
  Empty,
  Input,
  List,
  Popconfirm,
  Space,
  Tag,
  Typography,
  message,
} from 'antd'
import { CheckCircleOutlined, SearchOutlined } from '@ant-design/icons'
import useGetStatementRequests from '../hooks/useGetStatementRequests'
import useChangeStatementStatus from '../hooks/useChangeStatementStatus'

const { Title, Text } = Typography

function Statements() {
  const { data = [], loading } = useGetStatementRequests()
  const { changeStatementStatus, loading: updating } =
    useChangeStatementStatus()

  const [query, setQuery] = useState('')
  const [doneIds, setDoneIds] = useState({})

  const filtered = useMemo(() => {
    if (!query?.trim()) return data
    const q = query.toLowerCase()
    return data.filter((it) =>
      [it?.storeName, it?.email, it?.address, it?.start, it?.end]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    )
  }, [data, query])

  const handleMarkAsDone = async (item) => {
    try {
      await changeStatementStatus({ statementId: item?.id })
      setDoneIds((prev) => ({ ...prev, [item?.id]: true }))
      message.success('Marked as done')
    } catch (e) {
      message.error('Failed to update. Please try again.')
    }
  }

  return (
    <div className='space-y-5'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <Title level={3} className='!m-0'>
            Statement Requests
          </Title>
          <Text type='secondary'>Review and complete store statements</Text>
        </div>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder='Search by store, email, address, dates…'
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: 360 }}
        />
      </div>

      <Card className='rounded-2xl shadow-sm'>
        {(!filtered || filtered.length === 0) && !loading ? (
          <Empty description='No statement requests' />
        ) : (
          <List
            loading={loading}
            dataSource={filtered}
            itemLayout='vertical'
            split
            renderItem={(item) => {
              const isDone =
                doneIds[item?.id] ||
                String(item?.status).toUpperCase() === 'DONE'
              const statusColor = isDone ? 'success' : 'processing'

              return (
                <List.Item>
                  <div className='grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-center'>
                    <div className='space-y-2'>
                      <div className='flex flex-wrap items-center gap-2'>
                        <Text strong className='text-base'>
                          {item?.storeName || 'Unknown Store'}
                        </Text>
                        <Tag color={statusColor}>
                          {isDone ? 'DONE' : 'PENDING'}
                        </Tag>
                      </div>

                      <div className='text-[13px] text-gray-600'>
                        <div>
                          <Text type='secondary'>Email:</Text>{' '}
                          <Text copyable>{item?.email || '-'}</Text>
                        </div>
                        <div className='mt-1'>
                          <Text type='secondary'>Address:</Text>{' '}
                          <Text>{item?.address || '-'}</Text>
                        </div>
                      </div>

                      <div className='text-[13px]'>
                        <div>
                          <Text type='secondary'>Period:</Text>{' '}
                          <Text>
                            {item?.start} → {item?.end}
                          </Text>
                        </div>
                        <div className='mt-1'>
                          <Text type='secondary'>Requested at:</Text>{' '}
                          <Text>{item?.createdAt}</Text>
                        </div>
                      </div>
                    </div>
                    <Space className='justify-end'>
                      <Popconfirm
                        title='Mark as Done'
                        description='Are you sure you want to mark this statement as done?'
                        okText='Mark done'
                        onConfirm={() => handleMarkAsDone(item)}
                        okButtonProps={{ icon: <CheckCircleOutlined /> }}
                        disabled={isDone}>
                        <Button
                          type={isDone ? 'default' : 'primary'}
                          icon={<CheckCircleOutlined />}
                          disabled={isDone}
                          loading={updating && !isDone}>
                          {isDone ? 'Completed' : 'Mark as Done'}
                        </Button>
                      </Popconfirm>
                    </Space>
                  </div>
                </List.Item>
              )
            }}
          />
        )}
      </Card>
    </div>
  )
}

export default Statements
