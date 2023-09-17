import axios from 'axios'
const baseUrl = 'http://localhost:3000/api/blogs'

let token = null;

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

  console.log(config)

  const resp = await axios.post(baseUrl, blog, config)
  return resp.data
}

export default { getAll, create, setToken }
