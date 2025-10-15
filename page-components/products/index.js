/* eslint-disable indent */
import { useEffect, useMemo, useState } from 'react'
import {
  Select,
  Card,
  Divider,
  Checkbox,
  Pagination,
  Skeleton,
  Empty,
} from 'antd'
import { Image } from 'antd'
import { useRouter } from 'next/router'
import { usePathname, useSearchParams } from 'next/navigation'
import useGetContext from '@/common/context/useGetContext'
import useGetProducts from './hooks/useGetProducts'
import useQuerySearch from './hooks/useQuerySearch'
import useIsMobile from '@/utils/useIsMobile'
import ProductCard from '@/components/product-card'

function Products() {
  const { noveltyData } = useGetContext()
  const subCategories = noveltyData?.general?.subCategories || []
  const categories = noveltyData?.general?.categories || []

  const [category, setCategory] = useState([1])
  const [productsData, setProductsData] = useState()
  const [selectedFilters, setSelectedFilters] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 })
  const [sorting, setSorting] = useState({ sortBy: 'name', order: 'ASC' })
  const { isMobile } = useIsMobile()

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { replace, query, push } = useRouter()

  const { getProducts, loading } = useGetProducts({ setProductsData })
  const { querySearch } = useQuerySearch({ setProductsData })

  const products = useMemo(() => productsData?.products || [], [productsData])
  const filterOptions = subCategories
    .filter((sc) => category.includes(sc.cat_id))
    .flatMap((sc) => sc.values || [])

  const updateURLParams = (newParams) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    replace(`${pathname}?${params.toString()}`)
  }

  useEffect(() => {
    setCategory([Number(query?.category) || 1])
  }, [query?.category])

  useEffect(() => {
    const subCatParam = selectedFilters.join(',')

    if (query?.search) {
      updateURLParams({
        search: query?.search,
        sortBy: sorting.sortBy,
        order: sorting.order,
      })
      querySearch({ query: query?.search })
      return
    }

    if (subCatParam) {
      updateURLParams({
        subCategoriesList: subCatParam,
        page: pagination.page,
        pageSize: pagination.pageSize,
        sortBy: sorting.sortBy,
        order: sorting.order,
      })

      getProducts({
        subCategoriesList: subCatParam,
        pagination,
        sorting,
      })
    }
  }, [selectedFilters, pagination, sorting, query?.search])

  const handleFilterChange = (checked, valueId) => {
    setSelectedFilters((prev) =>
      checked ? [...prev, valueId] : prev.filter((v) => v !== valueId),
    )
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handlePagination = (page, pageSize) => {
    setPagination({ page, pageSize })
  }

  const handleSortChange = (value) => {
    const [sortBy, order] = value.split('-')
    setSorting({ sortBy, order })
  }

  const CategoryTitle =
    categories?.find((cat) => cat?.value === category[0])?.label || 'PRODUCTS'

  return (
    <div className='w-full bg-[#f5f5f5] p-4 md:p-6 flex gap-5'>
      {query?.category && !isMobile && (
        <aside className='w-1/5'>
          <div className='text-base font-semibold text-[#341809]'>
            Filter by
          </div>
          <Divider className='!my-3' />
          <div className='flex flex-col gap-2 max-h-[70vh] overflow-auto pr-1'>
            {filterOptions?.map((filter) => (
              <label
                key={filter.value}
                className='flex items-center gap-2 cursor-pointer'>
                <Checkbox
                  checked={selectedFilters.includes(filter.value)}
                  onChange={(e) =>
                    handleFilterChange(e.target.checked, filter.value)
                  }
                />
                <span className='text-sm'>{filter.label}</span>
              </label>
            ))}
            {!filterOptions?.length && (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description='No filters'
              />
            )}
          </div>
        </aside>
      )}
      <main className='flex-1'>
        <div className='w-full flex flex-col md:flex-row justify-between items-center mb-3 gap-3'>
          <h2 className='text-2xl font-bold text-[#341809] uppercase'>
            {CategoryTitle}
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
        <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5'>
          {loading
            ? Array.from({ length: 10 }).map((_, idx) => (
                <Card
                  key={idx}
                  className='h-full rounded-2xl'
                  cover={
                    <Skeleton.Image
                      active
                      style={{ width: '240px', height: 160 }}
                    />
                  }>
                  <Skeleton active paragraph={{ rows: 2 }} />
                </Card>
              ))
            : products.map((product, i) => (
                <ProductCard key={product?.id ?? i} item={product} />
              ))}
        </div>
        {!query?.search && (
          <div className='mt-5 flex justify-end'>
            <Pagination
              current={pagination.page}
              pageSize={pagination.pageSize}
              total={productsData?.totalElements || 0}
              onChange={handlePagination}
              showSizeChanger
              pageSizeOptions={['12', '20', '30', '40', '50']}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default Products
