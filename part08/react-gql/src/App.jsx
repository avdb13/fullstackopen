import React, { useState, useEffect } from 'react'
import { useApolloClient, useMutation, useQuery, useSubscription } from '@apollo/client'
import LoginForm from './components/LoginForm'
import { ALL_PERSONS, FIND_PERSON, ADD_PERSON, EDIT_NUMBER, PERSON_ADDED } from './queries'
import { updateCache } from './helpers'

const Person = ({ person, onClose }) => {
  return (
    <div>
      <h2>{person.name}</h2>
      <div>
        {person.address.street} {person.address.city}
      </div>
      <div>{person.phone}</div>
      <button onClick={onClose}>close</button>
    </div>
  )
}

const Persons = ({ persons }) => {
  const [name, setName] = useState(null)
  const result = useQuery(FIND_PERSON, { variables: { name }, skip: !name })

  if (name && result.data) {
    return (
      <Person person={result.data.findPerson} onClose={() => setName(null)} />
    )
  }

  return (
    <div>
      <h2>Persons</h2>
      {persons.map((p) => (
        <div key={p.name}>
          {p.name} {p.phone}
          <button onClick={() => setName(p.name)}>show address</button>
        </div>
      ))}
    </div>
  )
}

const PersonForm = ({ setError }) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')

  const [addPerson] = useMutation(ADD_PERSON, {
    onError: (error) => {
      const message = error.graphQLErrors.map((e) => e.message).join('\n')
      setError(message)
    },
    update: (cache, resp) => {
      cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) => {
        return {
          allPersons: allPersons.concat(resp.data.addPerson)
        }
      })
    }
  })

  const submit = (event) => {
    event.preventDefault()

    addPerson({
      variables: { name, phone: phone > 0 ? phone : undefined, street, city }
    })

    setName('')
    setPhone('')
    setStreet('')
    setCity('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submit}>
        <div>
          name <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          phone{' '}
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          street{' '}
          <input value={street} onChange={(e) => setStreet(e.target.value)} />
        </div>
        <div>
          city <input value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  )
}

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }

  return <div style={{ color: 'orangered' }}>{errorMessage}</div>
}

const PhoneForm = ({ setError }) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const [editNumber, result] = useMutation(EDIT_NUMBER)

  const submit = (event) => {
    event.preventDefault()

    editNumber({
      variables: { name, phone }
    })

    setName('')
    setPhone('')
  }

  useEffect(() => {
    if (result.data && result.data.editNumber === null) {
      setError('person not found!')
    }
  }, [result.data])

  return (
    <div>
      <h2>Change number</h2>
      <form onSubmit={submit}>
        <div>
          name <input onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          number <input onChange={(e) => setPhone(e.target.value)} />
        </div>
        <button type="submit">change</button>
      </form>
    </div>
  )
}

const App = () => {
  useSubscription(PERSON_ADDED, {
    onData: ({ data }) => {
      const addedPerson = data.data.personAdded
      updateCache(client.cache, { query: ALL_PERSONS }, addedPerson)
    }
  })
  const result = useQuery(ALL_PERSONS)
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const logout = () => {
    setToken(null)
    localStorage.removeItem('token')
    client.resetStore()
  }

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <LoginForm setToken={setToken} setError={notify} />
      </div>
    )
  }

  if (result.loading) {
    return <div>loading ...</div>
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <button onSubmit={logout}>logout</button>
      <Persons persons={result.data.allPersons} />
      <PersonForm setError={notify} />
      <PhoneForm setError={notify} />
    </div>
  )
}

export default App
