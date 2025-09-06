import { useContext } from 'react'

import { NoveltyContext, AVAILABLE_ACTIONS } from './index'

const useGetContext = () => {
  const { noveltyData, dispatchData } = useContext(NoveltyContext)
  return { noveltyData, dispatchData, AVAILABLE_ACTIONS }
}

export default useGetContext
