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

export default { getAll, setToken }
