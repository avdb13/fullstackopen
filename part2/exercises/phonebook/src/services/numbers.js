import axios from "axios";

// no leading `/api` since we have a proxy bypass
const baseUrl = `/api/persons`;

const getAll = () => axios.get(baseUrl).then((resp) => resp.data);

const create = (newObject) =>
  axios.post(baseUrl, newObject).then((resp) => resp.data);

const update = (newObject, id) =>
  axios.put(`${baseUrl}/${id}`, newObject).then((resp) => resp.data);

const remove = (id) => axios.delete(`${baseUrl}/${id}`);

export default { getAll, create, update, remove };
