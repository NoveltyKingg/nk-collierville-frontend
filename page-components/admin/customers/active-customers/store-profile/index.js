import React, { useEffect, useMemo } from 'react'
import {
  Card,
  Divider,
  Image,
  Select,
  Skeleton,
  Tag,
  Typography,
  Empty,
  Button,
} from 'antd'
import { useRouter } from 'next/router'
import {
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import useGetProfile from '@/page-components/admin/hooks/useGetProfile'

const { Text, Title } = Typography

const TIER_OPTIONS = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
  { label: 'D', value: 'D' },
]

const fmtMoney = (n) =>
  (Number.isFinite(+n) ? +n : 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  })

const fmtDate = (d) => (d ? dayjs(d).format('MM-DD-YYYY') : '—')

export default function StoreProfile() {
  const { query, back } = useRouter()
  const { getProfile, data, loading } = useGetProfile({
    userId: query?.user_id,
  })

  useEffect(() => {
    if (query?.storeId) getProfile({ storeId: query.storeId })
  }, [query?.storeId])

  const kpis = useMemo(
    () => [
      {
        key: 'orders',
        label: 'Total Orders',
        value: (data?.totalOrders ?? 0).toLocaleString(),
        icon: <FileTextOutlined />,
      },
      {
        key: 'last_order',
        label: 'Last Ordered',
        value: fmtDate(data?.lastOrderedDate),
        icon: <CalendarOutlined />,
      },
      {
        key: 'sales',
        label: 'Total Sales',
        value: fmtMoney(data?.totalSales ?? 0),
        icon: <GlobalOutlined />,
      },
      {
        key: 'tier',
        label: 'Tier',
        value: data?.tier || '—',
        icon: <HomeOutlined />,
      },
    ],
    [data],
  )

  const TierTag = ({ tier }) => {
    const color =
      tier === 'A'
        ? 'green'
        : tier === 'B'
        ? 'blue'
        : tier === 'C'
        ? 'orange'
        : 'default'
    return (
      <Tag color={color} className='px-2'>
        {tier || '—'}
      </Tag>
    )
  }

  return (
    <div className='space-y-6 p-6'>
      <div className='flex items-start justify-between gap-3'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <Button type='text' icon={<ArrowLeftOutlined />} onClick={back} />
            <Title level={3} className='!m-0'>
              {data?.storeName || 'Store Profile'}
            </Title>
          </div>
          <Text type='secondary'>
            Store ID:&nbsp;
            <Text code>{query?.storeId || '—'}</Text>
          </Text>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {(loading ? Array.from({ length: 4 }) : kpis).map((k, idx) => (
          <Card
            key={k?.key ?? idx}
            className='rounded-2xl shadow-sm hover:shadow transition'>
            {loading ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
              <>
                <div className='grid grid-cols-[auto_1fr] gap-3 items-center'>
                  <div className='h-11 w-11 rounded-2xl grid place-items-center bg-slate-100'>
                    {k.icon}
                  </div>
                  <div>
                    <div className='text-slate-500 text-xs'>{k.label}</div>
                    <div className='text-xl font-semibold -mt-0.5'>
                      {k.value}
                    </div>
                  </div>
                </div>
                {/* <div className='mt-3'>
                  <Tag
                    color={
                      k.deltaType === 'up'
                        ? 'success'
                        : k.deltaType === 'down'
                        ? 'error'
                        : 'default'
                    }>
                    {k.deltaText}
                  </Tag>
                </div> */}
              </>
            )}
          </Card>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <Card className='rounded-2xl shadow-sm lg:col-span-2'>
          <div className='flex items-center justify-between'>
            <div className='text-slate-700 font-medium'>Store Details</div>
            {!loading && <TierTag tier={data?.tier} />}
          </div>
          <Divider className='my-3' />
          {loading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : !data ? (
            <Empty description='No store data' />
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8'>
              <div className='space-y-1'>
                <Text type='secondary'>Store Address</Text>
                <div>
                  {data?.address1 || '—'}
                  {data?.address2 ? `, ${data.address2}` : ''}
                </div>
              </div>

              <div className='space-y-1'>
                <Text type='secondary'>City / State</Text>
                <div>
                  {data?.city || '—'} {data?.state ? `, ${data.state}` : ''}
                </div>
              </div>

              <div className='space-y-1'>
                <Text type='secondary'>Country</Text>
                <div>{data?.country || '—'}</div>
              </div>

              <div className='space-y-1'>
                <Text type='secondary'>Zip</Text>
                <div>{data?.zipCode || '—'}</div>
              </div>

              <div className='space-y-1'>
                <Text type='secondary'>Mobile Number</Text>
                <div className='flex items-center gap-2'>
                  <PhoneOutlined />
                  <span>{data?.phone || '—'}</span>
                </div>
              </div>

              <div className='space-y-1'>
                <Text type='secondary'>Email</Text>
                <div className='flex items-center gap-2'>
                  <MailOutlined />
                  <span>{data?.storeEmail || '—'}</span>
                </div>
              </div>

              <div className='space-y-1'>
                <Text type='secondary'>Tier</Text>
                <div className='flex items-center gap-2'>
                  <Select
                    disabled
                    options={TIER_OPTIONS}
                    style={{ width: 160 }}
                    value={data?.tier}
                  />
                  <TierTag tier={data?.tier} />
                </div>
              </div>

              <div className='space-y-1'>
                <Text type='secondary'>Tax ID</Text>
                <div>{data?.taxId || '—'}</div>
              </div>

              <div className='space-y-1'>
                <Text type='secondary'>Expiry Date</Text>
                <div>{fmtDate(data?.expiryDate)}</div>
              </div>
            </div>
          )}
        </Card>

        <Card className='rounded-2xl shadow-sm'>
          <div className='text-slate-700 font-medium'>Sales Snapshot</div>
          <Divider className='my-3' />
          {loading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Text type='secondary'>Total Sales</Text>
                <Text strong className='tabular-nums'>
                  {fmtMoney(data?.totalSales ?? 0)}
                </Text>
              </div>
              <div className='flex items-center justify-between'>
                <Text type='secondary'>Total Orders</Text>
                <Text strong className='tabular-nums'>
                  {(data?.totalOrders ?? 0).toLocaleString()}
                </Text>
              </div>
              <div className='flex items-center justify-between'>
                <Text type='secondary'>Last Order</Text>
                <Text strong>{fmtDate(data?.lastOrderedDate)}</Text>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card className='rounded-2xl shadow-sm'>
        <div className='flex items-center justify-between'>
          <div className='text-slate-700 font-medium'>Documents</div>
          <Button type='default' icon={<FileTextOutlined />}>
            Export
          </Button>
        </div>
        <Divider className='my-3' />
        {loading ? (
          <Skeleton active paragraph={{ rows: 2 }} />
        ) : (data?.documentUrls?.length ?? 0) === 0 ? (
          <Empty description='No documents uploaded' />
        ) : (
          <Image.PreviewGroup>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
              {data?.documentUrls?.map((item) => (
                <Image
                  src={item}
                  alt='document'
                  width={220}
                  height={140}
                  key={item}
                  className='rounded-lg object-cover shadow-sm'
                />
              ))}
            </div>
          </Image.PreviewGroup>
        )}
      </Card>
    </div>
  )
}
