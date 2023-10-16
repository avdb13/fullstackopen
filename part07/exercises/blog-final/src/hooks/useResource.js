import axios from 'axios'
import { useState } from 'react'

const useResource = (baseUrl) => {
  const [resource, setResource] = useState(null)

  const getAll = () => axios.get(baseUrl)
    .then(resp => setResource(resp.data))
  const create = (newObject, config) => axios.post(baseUrl, newObject, config)
    .then(resp => resp.data)
  const update = (id, newObject, config) => axios.put(`${baseUrl}/${id}`, newObject, config)
    .then(resp => resp.data)
  const remove = (id, config) => axios.delete(`${baseUrl}/${id}`, config)
    .then(resp => resp.data)

  const service = {
    getAll,
    create,
    update,
    remove
  }

  return {
    resource,
    service
  }
}

export default useResource
