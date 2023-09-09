import axios from "axios";
const baseUrl = `http://localhost:3000/notes`

const getAll = () => axios.get(baseUrl).then(resp => resp.data)
const create = (newObject) => axios.post(baseUrl, newObject).then(resp => resp.data)
const update = (newObject, id) => axios.put(`${baseUrl}/${id}`, newObject).then(resp => resp.data)

export default { getAll, create, update }