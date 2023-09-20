import { createSlice } from '@reduxjs/toolkit'

import anecdoteService from '../services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      return [...state, action.payload]
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    updateVote(state, action) {
      return state.map((anecdote) =>
        anecdote.id === action.payload.id ? action.payload : anecdote,
      )
    },
  },
})

export const { appendAnecdote, setAnecdotes, updateVote } = anecdoteSlice.actions

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const anecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(anecdote))
  }
}

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const addVote = (id) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.update(id)
    dispatch(updateVote(newAnecdote))
  }
}

export default anecdoteSlice.reducer
