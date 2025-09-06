/* eslint-disable indent */
import { useEffect, useMemo, useState } from 'react'
import { Select, Card, Divider, Checkbox, Pagination } from 'antd'
import useGetContext from '@/common/context/useGetContext'
import useGetProducts from './hooks/useGetProducts'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import useQuerySearch from './hooks/useQuerySearch'
import useIsMobile from '@/utils/useIsMobile'
import { Image } from 'antd'

function Products() {
  const context = useGetContext()
  const [category, setCategory] = useState([1])
  const [productsData, setProductsData] = useState()
  const subCategories = context?.noveltyData?.general?.subCategories || []
  const categories = context?.noveltyData?.general?.categories || []
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { replace, query, push } = useRouter()

  const [selectedFilters, setSelectedFilters] = useState([])
  const [pagination, setPagination] = useState({ page: 1, size: 20 })
  const [sorting, setSorting] = useState({ sortBy: 'name', order: 'ASC' })

  const { getProducts, loading } = useGetProducts({ setProductsData })
  const { querySearch } = useQuerySearch({ setProductsData })

  const { isMobile } = useIsMobile()

  console.log(categories, 'categories')

  const memoizedProducts = useMemo(() => {
    return productsData?.products || []
  }, [productsData])

  const memoizedSelectedFilters = useMemo(() => {
    return selectedFilters
  }, [selectedFilters])

  const filterOptions = subCategories
    .filter((sc) => category.includes(sc.cat_id))
    .flatMap((sc) => sc.values || [])

  const updateURLParams = (newParams) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    replace(`${pathname}?${params.toString()}`)
  }

  useEffect(() => {
    setCategory([Number(query?.category) || 1])
  }, [JSON.stringify(query?.category)])

  useEffect(() => {
    const subCatParam = selectedFilters.join(',')
    if (subCatParam) {
      updateURLParams({
        subCategoriesList: subCatParam,
        page: pagination.page,
        pageSize: pagination.size,
        sortBy: sorting.sortBy,
        order: sorting.order,
      })

      getProducts({
        subCategoriesList: subCatParam,
        pagination,
        sorting,
      })
    }

    if (query?.search) {
      updateURLParams({
        search: query?.search,
        sortBy: sorting.sortBy,
        order: sorting.order,
      })
      querySearch({ query: query?.search })
    }
  }, [selectedFilters, pagination, sorting])

  const handleFilterChange = (checkedValue, valueId) => {
    setSelectedFilters((prev) =>
      checkedValue ? [...prev, valueId] : prev.filter((v) => v !== valueId),
    )
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handlePagination = (page, pageSize) => {
    setPagination((prev) => ({ ...prev, page: page, size: pageSize }))
  }

  const handleSortChange = (value) => {
    const [sortBy, order] = value.split('-')
    setSorting({ sortBy, order })
  }

  return (
    <div className='w-full bg-[#f5f5f5] p-4 flex gap-[20px]'>
      {query?.category && !isMobile && (
        <div className='w-1/5'>
          <div>Filter by</div>
          <Divider />
          <div className='flex flex-col gap-2'>
            {filterOptions?.map((filter) => (
              <div key={filter.value} className='flex items-center gap-2'>
                <Checkbox
                  checked={memoizedSelectedFilters.includes(filter.value)}
                  onChange={(e) =>
                    handleFilterChange(e.target.checked, filter.value)
                  }
                />
                {filter.label}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className='w-full'>
        <div className='w-full flex flex-col md:flex-row justify-between items-center mb-3'>
          <h2 className='text-2xl font-bold text-[#341809] mb-3 md:mb-0 uppercase'>
            {categories?.find((cat) => cat?.value === category[0])?.label ||
              'PRODUCTS'}
          </h2>

          <Select
            defaultValue='name-ASC'
            style={{ width: 250 }}
            onChange={handleSortChange}
            options={[
              { value: 'recommended-ASC', label: 'Recommended' },
              { value: 'sell-ASC', label: 'Price: Low to High' },
              { value: 'sell-DESC', label: 'Price: High to Low' },
              { value: 'name-ASC', label: 'Name A - Z' },
              { value: 'name-DESC', label: 'Name Z - A' },
            ]}
          />
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
          {loading
            ? Array.from({ length: 8 }).map((_, idx) => (
                <Card key={idx} loading={true} className='w-full' />
              ))
            : memoizedProducts.map((product) => (
                <Card
                  key={product.id}
                  hoverable
                  onClick={() => push(`/product/${product?.id}`)}
                  cover={
                    <Image
                      alt={product.name}
                      src={product.imageUrls[0]}
                      className='object-contain h-40 sm:h-40 md:h-52 lg:h-64 xl:h-80 px-4 py-2'
                    />
                  }
                  className='w-full [&.ant-card .ant-card-body]:p-4'>
                  <Card.Meta
                    title={
                      <p className='text-[#341809] font-semibold text-base'>
                        {product?.name?.toUpperCase()}
                      </p>
                    }
                    description={
                      <div>
                        <p className='text-[#ff8540] font-bold mt-2'>
                          ${product?.sell}
                        </p>
                      </div>
                    }
                  />
                </Card>
              ))}
        </div>
        {!query?.search && (
          <Pagination
            align='end'
            current={pagination?.page}
            size={pagination?.size}
            onChange={handlePagination}
            total={productsData?.totalElements}
          />
        )}
      </div>
    </div>
  )
}

export default Products
