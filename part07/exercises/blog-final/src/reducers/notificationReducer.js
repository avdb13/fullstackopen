import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      const { content, type } = action.payload
      return { content, type }
    },
  }
})

export default notificationSlice.reducer

export const newNotification = (message, timeout) => {
  return async dispatch => {
    dispatch(setNotification(message))
    setTimeout(() => dispatch(setNotification('')), timeout)
  }
}
export const { setNotification } = notificationSlice.actions
