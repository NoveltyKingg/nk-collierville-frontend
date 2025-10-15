import { App } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'

const useGetCountries = () => {
  const [countriesData, setCountriesData] = useState([])

  const { message } = App.useApp()

  useEffect(() => {
    axios
      .get('https://countriesnow.space/api/v0.1/countries/positions')
      .then((result) => {
        setCountriesData(result?.data?.data)
      })
      .catch((err) => {
        console.error(err)
        message.error(err?.data?.message || 'Something Went Wrong')
      })
  }, [])

  return { countriesData }
}

export default useGetCountries
