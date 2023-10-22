import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    filterChange(state, action) {
      state = action.payload
    }
  }
})

export const { filterChange } = createSlice
export default filterSlice.reducer
