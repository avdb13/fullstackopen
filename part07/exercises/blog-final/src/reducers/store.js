import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './notificationReducer'
import blogReducer from './blogReducer'
import usersReducer, { resetUser } from './usersReducer'

const handleError = store => next => action => {
  const state = store.getState()

  try {
    next(action)
  } catch(e) {
    if (e.response.data['error'] === 'jwt expired') {
      store.dispatch(resetUser())
    }
  }
}

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    users: usersReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(handleError)
})

export default store
