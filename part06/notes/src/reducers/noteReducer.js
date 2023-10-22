import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import noteService from '../services/notes'

const generateId = () => Number((Math.random() * 1000).toFixed(0))

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    toggleImportanceOf(state, action) {
      return state.map((n) =>
        n.id === action.payload ? { ...n, important: !n.important } : n,
      )
    },
    appendNote(state, action) {
      state.push(action.payload)
    },
    setNotes(state, action) {
      return action.payload
    }
  },
})

export const { toggleImportanceOf, appendNote, setNotes } = noteSlice.actions

export const initializeNotes = () => {
  return async (dispatch) => {
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))
  }
}

export const createNote = (content) => {
  return async (dispatch) => {
    const note = await noteService.createNew(content)
    dispatch(appendNote(note))
  }
}

export default noteSlice.reducer
