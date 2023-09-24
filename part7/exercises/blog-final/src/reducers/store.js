import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './notificationReducer'
import blogReducer from './blogReducer'
import userReducer, { resetUser } from './userReducer'

const handleError = store => next => action => {
  const state = store.getState()
  // console.log(state)
  // console.log(action)

  try {
    next(action)
  } catch(e) {
    console.log(e)
    if (e.response.data['error'] === 'jwt expired') {
      store.dispatch(resetUser())
    }
  }
}

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    user: userReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(handleError)
})

export default store
