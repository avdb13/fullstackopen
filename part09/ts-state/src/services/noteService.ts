import axios from "axios"
import { NewNote, Note } from "../types"


const baseUrl = 'http://localhost:3000/notes'

export const getAllNotes = () => {
  return axios
    .get<Note[]>(baseUrl)
    .then(resp => resp.data)
}

export const createNote = (noteToAdd: NewNote) => {
  return axios
    .post<Note>('http://localhost:3000/notes', { content: noteToAdd })
    .then(resp => resp.data)
}
