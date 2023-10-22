import axios from 'axios'

const baseUrl = 'http://localhost:3000/notes'

const getAll = async () => {
  const resp = await axios.get(baseUrl)
  return resp.data
}

const createNew = async (content) => {
  const obj = { content, important: false }
  const resp = await axios.post(baseUrl, obj)
  return resp.data
}

const update = async (id) => {
  const { data } = await axios.get(baseUrl)
  const note = data.find(note => note.id === id)
  const resp = await axios.put(`${baseUrl}/${id}`, { ...note, important: !note.important })
  return resp.data
}

export default { getAll, createNew, update }
