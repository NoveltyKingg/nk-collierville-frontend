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
  const isNavigatingRef = useRef(false) // <- block fetch after Enter
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

  // cleanup
  useEffect(() => () => debounceFetcher.cancel(), [debounceFetcher])

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()

      // 1) prevent any pending debounced fetch from firing
      isNavigatingRef.current = true
      debounceFetcher.cancel()
      setFetching(false)

      // 2) go to products page; Products page will make the API call
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
        onSearch?.(val) // update parent immediately
        if (isNavigatingRef.current) return // block fetch after Enter
        debounceFetcher(val) // debounce ONLY the fetch
      }}
      onInputKeyDown={handleInputKeyDown} // v5: key events on input
      onBlur={() => {
        isNavigatingRef.current = false
      }} // reset if needed
      notFoundContent={fetching ? 'Loading...' : null}
      onSelect={(e) => handleSelect(e, searchValue)}
      defaultActiveFirstOption={false}
      {...props}
    />
  )
}

export default DebounceSelect
