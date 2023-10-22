import axios from 'axios'

const baseUrl = 'http://localhost:3000/anecdotes'

export const getAnecdotes = async () => {
  const resp = await axios.get(baseUrl)
  return resp.data
}
export const createAnecdote = async (newAnecdote) => {
  if (newAnecdote.content.length < 5) {
    throw Error('too short anecdote, must have length 5 or more')
  }
  const resp = await axios.post(baseUrl, newAnecdote)
  return resp.data
}
export const updateAnecdote = async (updatedAnecdote) => {
  const resp = axios.put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote)
  return resp.data
}
