/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useReducer } from 'react'

import { AVAILABLE_ACTIONS } from './actions'
import reducer from './reducer'

const NoveltyContext = createContext()

const initialState = {
  general: {
    isMobile: false,
    cart: 0,
  },
  profile: {
    isLoggedIn: false,
  },
}

function ArticleProvider({ children }) {
  const [noveltyData, dispatch] = useReducer(reducer, { ...initialState })

  const dispatchData = (type, data) => {
    dispatch({ type, data })
  }

  return (
    <NoveltyContext.Provider value={{ noveltyData, dispatchData }}>
      {children}
    </NoveltyContext.Provider>
  )
}

export { NoveltyContext, AVAILABLE_ACTIONS }

export default ArticleProvider
