import axios from 'axios'

const baseUrl = 'http://localhost:3000/anecdotes'

const getAll = async () => {
  const resp = await axios.get(baseUrl)
  console.log(resp.data)
  return resp.data
}

const createNew = async (content) => {
  const resp = await axios.post(baseUrl, { content, votes: 0 })
  console.log(resp.data)
  return resp.data
}

export default { getAll, createNew }
