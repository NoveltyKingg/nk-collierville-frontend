/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Input, Button, Space, Table, Card } from 'antd'
import {
  SearchOutlined,
  DollarOutlined,
  FileTextOutlined,
  ProjectOutlined,
} from '@ant-design/icons'
import useGetCustomers from '../../hooks/useGetCustomers'
import useSearchStore from '../../hooks/useSearchStore'
import { useRouter } from 'next/router'
import getColumns from './columns'

const { Search } = Input

const safeLower = (v) => (v ?? '').toString().toLowerCase()

const MetricsCard = ({ icon, title, amount }) => {
  return (
    <Card className='rounded-2xl shadow-sm hover:shadow gap-3 items-center [&.ant-card .ant-card-body]:p-4'>
      <div className='h-11 w-11 rounded-2xl grid place-items-center bg-slate-100'>
        {icon}
      </div>
      <div>
        <div className='text-slate-500 text-xs'>{title}</div>
        <div className='text-xl font-semibold -mt-0.5'>{amount}</div>
      </div>
    </Card>
  )
}

function ActiveCustomers() {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)

  const { push } = useRouter()
  const { getCustomers, customersData, customersLoading } =
    useGetCustomers('ACTIVE')
  const { searchStore, storeData, searchLoading } = useSearchStore()

  const data = useMemo(() => {
    const src = storeData?.length ? storeData : customersData || []
    return src.map((r, i) => ({
      key: r.key ?? r.storeId ?? r.userId ?? i,
      ...r,
    }))
  }, [customersData, storeData])

  const metrics = useMemo(() => {
    const totalOutstanding = data.reduce(
      (acc, r) => acc + (Number(r.balance) || 0),
      0,
    )
    const overdue = data
      .filter((r) =>
        ['OVERDUE', 'DUE', 'LATE'].includes((r.status || '').toUpperCase()),
      )
      .reduce(
        (acc, r) => acc + (Number(r.totalOutstanding) || Number(r.amount) || 0),
        0,
      )
    const inDraft = data
      .filter((r) => (r.status || '').toUpperCase() === 'DRAFT')
      .reduce(
        (acc, r) => acc + (Number(r.totalOutstanding) || Number(r.amount) || 0),
        0,
      )
    const totalCustomers = data.length

    return {
      totalOutstanding,
      overdue,
      inDraft,
      totalCustomers,
    }
  }, [data])

  useEffect(() => {
    getCustomers()
  }, [])

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters) => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (dataIndex, placeholder = '') => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={placeholder || `Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}>
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size='small'
            style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              confirm({ closeDropdown: false })
              setSearchText(selectedKeys[0])
              setSearchedColumn(dataIndex)
            }}>
            Filter
          </Button>
          <Button type='link' size='small' onClick={() => close()}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      safeLower(record[dataIndex]).includes(safeLower(value)),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 120)
      }
    },
    render: (text) => (searchedColumn === dataIndex ? text : text),
  })

  const columns = getColumns({ getColumnSearchProps })

  return (
    <div className='space-y-6 w-full'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h2 className='text-2xl font-semibold'>Customers</h2>
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <MetricsCard
          icon={<DollarOutlined size={18} />}
          title='Total Outstanding'
          amount={metrics.totalOutstanding}
        />
        <MetricsCard
          icon={<FileTextOutlined />}
          title='In Draft'
          amount={metrics.inDraft}
        />
        <MetricsCard
          icon={<ProjectOutlined />}
          title='Total Customers'
          amount={metrics.totalCustomers}
        />
      </div>
      <Card className='rounded-2xl shadow-sm'>
        <div className='flex items-center justify-between mb-3'>
          <div className='text-slate-600'>
            <span className='font-medium'>Customers List</span>
            <span className='text-slate-400 ml-2 text-sm'>
              Total {data.length.toLocaleString()}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <Search
              placeholder='Search...'
              allowClear
              onSearch={(v) => searchStore({ search: v })}
              style={{ width: 220 }}
            />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          size='middle'
          sticky
          loading={searchLoading || customersLoading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 'max-content' }}
          onRow={(record) => ({
            onDoubleClick: () =>
              push(`/admin/store/${record?.userId}?storeId=${record?.storeId}`),
          })}
          className='rounded-xl'
          style={{ cursor: 'pointer' }}
        />
      </Card>
    </div>
  )
}

export default ActiveCustomers
