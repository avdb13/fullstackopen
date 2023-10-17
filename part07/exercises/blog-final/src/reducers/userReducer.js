import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import registerService from '../services/register'
import { newNotification } from './notificationReducer'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    set(state, action) {
      return action.payload
    }
  }
})

const { set } = userSlice.actions

export const loginUser = (credentials) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('blogUser', JSON.stringify(user))
      dispatch(set(user))
    } catch(e) {
      e.message === 'Network Error'
        ? dispatch(
          newNotification({
            content: 'backend refused connection',
            type: 'error',
          }, 5000),
        )
        : dispatch(
          newNotification(
            { content: 'wrong credentials', type: 'error' },
            5000,
          ),
        )
    }

  }
}

export const autoLoginUser = () => {
  return async (dispatch) => {
    const json = window.localStorage.getItem('blogUser')
    if (json) {
      dispatch(set(JSON.parse(json)))
    }
  }
}

export const resetUser = () => {
  return async (dispatch) => {
    window.localStorage.removeItem('blogUser')
    dispatch(set(''))
  }
}

export const registerUser = ({ username, name, password }) => {
  return async (dispatch) => {
    await registerService.register({ username, name, password })
    const user = await loginService.login({ username, password })
    dispatch(set(user))
  }
}

export default userSlice.reducer
