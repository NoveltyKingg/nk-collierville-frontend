import { useState } from 'react'
import axios from 'axios'
import { App } from 'antd'

const useGetCitiesByState = () => {
  const [citiesData, setCitiesData] = useState([])

  const { message } = App.useApp()

  const getCitiesByState = ({ country, state }) => {
    axios
      .post('https://countriesnow.space/api/v0.1/countries/state/cities', {
        country,
        state,
      })
      .then((result) => {
        setCitiesData(result?.data?.data)
      })
      .catch((err) => {
        console.error(err)
        message.error(err?.data?.message || 'Something Went Wrong')
      })
  }

  return { getCitiesByState, citiesData }
}

export default useGetCitiesByState
