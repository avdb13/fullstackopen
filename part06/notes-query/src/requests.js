import axios from 'axios'

const baseUrl = 'http://localhost:3000/notes'
export const getNotes = () =>
  axios.get(baseUrl).then(resp => resp.data)

export const createNote = (newNote) =>
  axios.post(baseUrl, newNote).then(resp => resp.data)

export const updateNote = (updatedNote) =>
  axios.put(`${baseUrl}/${updatedNote.id}`, updatedNote).then(resp => resp.data)
