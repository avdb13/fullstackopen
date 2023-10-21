import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import registerService from '../services/register'
import userService from '../services/users'
import { onError } from './errorHandler'

const usersSlice = createSlice({
  name: 'users',
  initialState: ({ me: null, all: [] }),
  reducers: {
    set(state, action) {
      return ({ ...state, me: action.payload })
    },
    setAll(state, action) {
      return ({ ...state, all: action.payload })
    }
  }
})

const { set, setAll } = usersSlice.actions

export const loginUser = (credentials, redirect) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('blogUser', JSON.stringify(user))
      dispatch(set(user))
      redirect()
    } catch(e) {
      dispatch(onError(e, 'wrong credentials'))
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

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll()
    dispatch(setAll(users))
  }
}

export default usersSlice.reducer
