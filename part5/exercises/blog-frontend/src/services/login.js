import axios from 'axios'

const baseUrl = 'http://localhost:3000/api/login'
const login = async (credentials) => {
  const resp = await axios.post(baseUrl, credentials)
  return resp.data
}

export default { login }
