import Image from 'next/image'
import { useRouter } from 'next/router'

const ProductCard = ({ item }) => {
  const { push } = useRouter()
  return (
    <button
      onClick={() => push(`/product/${item?.id}`)}
      className='w-[240px] shrink-0 rounded-xl border border-zinc-100 bg-white p-3 hover:shadow transition snap-center text-left cursor-pointer'>
      <div className='relative w-full h-[180px] rounded-lg overflow-hidden'>
        <Image
          src={item.imageUrls?.[0]}
          alt={item.name}
          fill
          sizes='220px'
          className='object-contain'
        />
      </div>
      <div className='mt-3 space-y-1'>
        <h3 className='font-semibold text-sm line-clamp-2 min-h-[2.6em]'>
          {item?.name}
        </h3>
        <p className='text-[#385f43] font-bold'>${item?.sell}</p>
      </div>
    </button>
  )
}

export default ProductCard
