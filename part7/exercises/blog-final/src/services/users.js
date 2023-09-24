import axios from 'axios'

const baseUrl = 'http://localhost:3000/api/users'

const getAll = async () => {
  const resp = await axios.get(baseUrl)
  return resp.data
}

export default { getAll }
