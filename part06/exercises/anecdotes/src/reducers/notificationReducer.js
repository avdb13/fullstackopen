import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload
    }
  }
})

export const { setNotification } = notificationSlice.actions

export const newNotification = (content, timeout) => {
  return async dispatch => {
    dispatch(setNotification(content))
    setTimeout(() => dispatch(setNotification('')), timeout)
  }
}
export default notificationSlice.reducer
