import { configureStore } from '@reduxjs/toolkit'
import messagesReducer from './slices/messages-slice'
import isRefreshingReducer from './slices/is-refreshing'
import unAuthorizedReducer from './slices/unAuthorized-slice'

export default configureStore({
  reducer: {
    messages: messagesReducer,
    isRefreshing: isRefreshingReducer,
    unAuthorized: unAuthorizedReducer,
  },
})