import { Typography } from 'antd'
import { Avatar } from 'antd'
import dayjs from 'dayjs'

const { Text } = Typography
const safeLower = (v) => (v ?? '').toString().toLowerCase()

const getColumns = ({ getColumnSearchProps }) => [
  {
    title: <div className='text-slate-600 font-medium'>Store Name</div>,
    dataIndex: 'customerName',
    key: 'customerName',
    width: 260,
    ...getColumnSearchProps('storeName', 'Search name'),
    render: (_, rec) => {
      const name = rec.storeName
      const email = rec.email || '-'
      const logo = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        name,
      )}`
      return (
        <div className='flex items-center gap-3'>
          <Avatar src={logo} size={34} className='shadow-sm' />
          <div className='leading-tight'>
            <div className='font-medium'>{name.toUpperCase()}</div>
            {email ? (
              <div className='text-xs text-slate-500'>{email}</div>
            ) : null}
          </div>
        </div>
      )
    },
    sorter: (a, b) =>
      safeLower(a.storeName || a.name).localeCompare(
        safeLower(b.storeName || b.name),
      ),
  },
  {
    title: <div className='text-slate-600 font-medium'>Customer Name</div>,
    dataIndex: 'customerName',
    key: 'customerName',
    width: 170,
    ...getColumnSearchProps('firstName', 'Search user'),
    render: (_, rec) => <div>{rec?.firstName + ' ' + rec?.lastName}</div>,
    sorter: (a, b) =>
      safeLower(a.firstName).localeCompare(safeLower(b.firstName)),
  },
  {
    title: <div className='text-slate-600 font-medium'>Mobile Number</div>,
    dataIndex: 'phone',
    key: 'phone',
    width: 110,
    align: 'center',
  },

  {
    title: (
      <div className='text-slate-600 font-medium text-right'>
        Total Outstanding
      </div>
    ),
    dataIndex: 'balance',
    key: 'balance',
    width: 160,
    align: 'right',
    sorter: (a, b) => (+a.balance || 0) - (+b.balance || 0),
    render: (_, rec) => (
      <span className='tabular-nums'>{rec.balance ?? 0}</span>
    ),
  },
  {
    title: <div className='text-slate-600 font-medium text-right'>Tier</div>,
    dataIndex: 'tier',
    key: 'tier',
    width: 160,
    align: 'right',
    sorter: (a, b) => a.tier.localeCompare(b.tier),
    render: (_, rec) => <span className='tabular-nums'>{rec.tier}</span>,
  },
  {
    title: <div className='text-slate-600 font-medium'>Date</div>,
    dataIndex: 'date',
    key: 'date',
    width: 140,
    sorter: (a, b) =>
      dayjs(a.date || a.createdAt).valueOf() -
      dayjs(b.date || b.createdAt).valueOf(),
    render: (v, rec) =>
      dayjs(v || rec.createdAt).isValid()
        ? dayjs(v || rec.createdAt).format('MM-DD-YYYY')
        : '—',
  },
]

export default getColumns
