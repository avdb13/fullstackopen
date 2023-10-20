import axios from 'axios'
import { useSelector } from 'react-redux'
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

// shouldn't be used in normal circumstances
const update = async (newBlog) => {
  const { user, id } = newBlog
  newBlog.user = user.id
  delete newBlog.id

  const resp = await axios.put(`${baseUrl}/${id}`, newBlog)
  return { ...resp.data, user, id }
}

const comment = async (id, comment) => {
  const resp = await axios.post(`${baseUrl}/${id}/comments`, comment)
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
