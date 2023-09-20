import axios from 'axios'

const baseUrl = 'http://localhost:3000/anecdotes'

const getAll = async () => {
  const resp = await axios.get(baseUrl)
  console.log(resp.data)
  return resp.data
}

const createNew = async (content) => {
  const resp = await axios.post(baseUrl, { content, votes: 0 })
  return resp.data
}

const update = async (id) => {
  const notes = await getAll()
  const note = notes.find(n => n.id === id)

  const resp = await axios.put(`${baseUrl}/${id}`, { ...note, votes: note.votes+1 })
  return resp.data
}

export default { getAll, createNew, update }
