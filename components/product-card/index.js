import { Image, Tooltip } from 'antd'
import { useRouter } from 'next/router'

const ProductCard = ({ item, isNewArrival }) => {
  const { push } = useRouter()
  return (
    <div
      onClick={() => push(`/product/${item?.id}`)}
      className='shrink-0 rounded-xl border border-zinc-100 bg-white p-3 hover:shadow transition snap-center text-left cursor-pointer'>
      <div className='w-full items-center justify-center'>
        <Image
          src={item.imageUrls?.[0]}
          alt={item.name}
          height={200}
          width={'100%'}
          preview={false}
        />
      </div>
      <div
        className={`mt-3 space-y-1 ${isNewArrival && 'w-[200px]'} uppercase`}>
        <Tooltip title={item?.name} color='#38455e'>
          <div className='font-semibold text-sm truncate'>{item?.name}</div>
        </Tooltip>
        <div className='text-[#38455e] font-bold'>${item?.sell}</div>
      </div>
    </div>
  )
}

export default ProductCard
