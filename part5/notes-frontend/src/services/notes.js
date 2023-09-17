import axios from "axios";
const baseUrl = `http://localhost:3000/api/notes`;

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () =>
  axios.get(baseUrl).then((resp) => {
    return resp.data;
  });

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const resp = await axios.post(baseUrl, newObject, config)
  return resp.data
}

const update = (newObject, id) =>
  axios.put(`${baseUrl}/${id}`, newObject).then((resp) => resp.data);

export default { getAll, create, update, setToken };
