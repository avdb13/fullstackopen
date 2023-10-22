import axios from "axios";
const baseUrl = `http://localhost:3000/api/notes`;

const getAll = () =>
  axios.get(baseUrl).then((resp) => {
    console.log(resp.data);
    return resp.data;
  });
const create = (newObject) =>
  axios.post(baseUrl, newObject).then((resp) => resp.data);
const update = (newObject, id) =>
  axios.put(`${baseUrl}/${id}`, newObject).then((resp) => resp.data);

export default { getAll, create, update };
