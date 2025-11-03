import { useMemo, useRef, useEffect, useState } from 'react'
import { Select } from 'antd'
import debounce from 'lodash/debounce'
import { useRouter } from 'next/router'

function DebounceSelect({
  fetchOptions,
  debounceTimeout = 600,
  optionRoute,
  handleSelect,
  admin,
  mode,
  searchValue,
  onSearch,
  ...props
}) {
  const [fetching, setFetching] = useState(false)
  const [options, setOptions] = useState([])
  const isNavigatingRef = useRef(false)
  const { push } = useRouter()

  const debounceFetcher = useMemo(() => {
    const loadOptions = async (value) => {
      if (!value) {
        setOptions([])
        setFetching(false)
        return
      }
      setFetching(true)
      const res = await fetchOptions({ params: { query: value } })
      const newOptions =
        res?.data?.map((item) => ({
          label: <div style={{ textTransform: 'uppercase' }}>{item?.name}</div>,
          value: item?.id,
        })) ?? []
      setOptions(newOptions)
      setFetching(false)
    }
    return debounce(loadOptions, debounceTimeout)
  }, [fetchOptions, debounceTimeout])

  useEffect(() => () => debounceFetcher.cancel(), [debounceFetcher])

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      isNavigatingRef.current = true
      debounceFetcher.cancel()
      setFetching(false)
      if (!admin && searchValue) {
        push(`${optionRoute}?search=${encodeURIComponent(searchValue)}`)
      }
    }
  }

  return (
    <Select
      showSearch
      filterOption={false}
      mode={mode}
      name='debounce_select'
      searchValue={searchValue}
      onSearch={(val) => {
        onSearch?.(val)
        if (isNavigatingRef.current) return
        debounceFetcher(val)
      }}
      options={options}
      onInputKeyDown={handleInputKeyDown}
      onBlur={() => {
        isNavigatingRef.current = false
      }}
      notFoundContent={fetching ? 'Loading...' : null}
      onSelect={(e) => handleSelect(e, searchValue)}
      defaultActiveFirstOption={false}
      {...props}
    />
  )
}

export default DebounceSelect
