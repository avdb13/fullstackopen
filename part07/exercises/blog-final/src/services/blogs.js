import axios from 'axios'
const baseUrl = 'http://localhost:3000/api/blogs'

const formatToken = (token) => `Bearer ${token}`

const getAll = async () => {
  const resp = await axios.get(baseUrl)
  return resp.data
}

const create = async (blog, token) => {
  const config = {
    headers: { Authorization: formatToken(token) }
  }

  const resp = await axios.post(baseUrl, blog, config)
  return resp.data
}

const comment = async (id, body, token) => {
  const config = token ? {
    headers: { Authorization: formatToken(token) }
  } : null

  const resp = await axios.post(`${baseUrl}/${id}/comments`, { body }, config)
  return resp.data
}

const like = async (id) => {
  const resp = await axios.post(`${baseUrl}/${id}/like`, {})
  console.log(resp.data)
  return resp.data
}

const remove = async (id, token) => {
  const config = {
    headers: { Authorization: formatToken(token) }
  }

  await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, create, like, comment, remove }
