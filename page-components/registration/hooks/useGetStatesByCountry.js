import { useState } from 'react'
import axios from 'axios'
import { message } from 'antd'

const useGetStateByCountry = () => {
  const [statesData, setStatesData] = useState([])

  const getStatesByCountry = ({ country }) => {
    axios
      .post('https://countriesnow.space/api/v0.1/countries/states', {
        country,
      })
      .then((result) => {
        setStatesData(result?.data?.data?.states)
      })
      .catch((err) => {
        console.error(err)
        message.error(err?.data?.message || 'Something Went Wrong')
      })
  }

  return { getStatesByCountry, statesData }
}

export default useGetStateByCountry
