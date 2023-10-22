import axios from 'axios'
const baseUrl = 'http://localhost:3000/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const resp = await axios.get(baseUrl)
  return resp.data
}

const create = async (blog) => {
  const config = {
    headers: { Authorization: token }
  }

  const resp = await axios.post(baseUrl, blog, config)
  return resp.data
}

const update = async (blog) => {
  blog = { ...blog, likes: (blog.likes || 0) + 1 }

  // not very idiomatic but it works ig
  const user = blog.user
  const id = blog.id

  blog.user = blog.user.id
  delete blog.id

  const config = {
    headers: { Authorization: token }
  }

  const resp = await axios.put(`${baseUrl}/${id}`, blog, config)
  return { ...resp.data, user, id }
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token }
  }

  const resp = await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, create, setToken, update, remove }
