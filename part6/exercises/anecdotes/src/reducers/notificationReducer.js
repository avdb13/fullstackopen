import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    newNotification(state, action) {
      state = action.payload
    }
  }
})

export const { newNotification } = notificationSlice.actions
export default notificationSlice.reducer
