import { createSlice } from '@reduxjs/toolkit'
import { newNotification } from './notificationReducer'
import { useDispatch } from 'react-redux'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return { content: anecdote, id: getId(), votes: 0 }
}

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      return [...state, action.payload]
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    addVote(state, action) {
      return state.map((anecdote) =>
        anecdote.id === action.payload
          ? { ...anecdote, votes: anecdote.votes + 1 }
          : anecdote)
    }
  }
})

export const { createAnecdote, setAnecdotes, addVote } = anecdoteSlice.actions
export default anecdoteSlice.reducer
