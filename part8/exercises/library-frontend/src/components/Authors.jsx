import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, EDIT_BIRTHYEAR } from '../queries'
import { useState } from 'react'

const Authors = ({ show, setError, token }) => {
  const [birthyear, setBirthyear] = useState('')
  const [name, setName] = useState('')

  const result = useQuery(ALL_AUTHORS)
  const [editBirthyear] = useMutation(EDIT_BIRTHYEAR, {
    onError: (e) => setError(e.graphQLErrors.map((e) => e.message).join('\n')),
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>loading ...</div>
  }

  const authors = result.data.allAuthors

  const submit = async (event) => {
    event.preventDefault()

    editBirthyear({
      variables: { name, birthyear: Number(birthyear) },
    })

    setName('')
    setBirthyear('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {token ? (
        <>
          <h2>Set birthyear</h2>
          <form onSubmit={submit}>
            <div>
              <select defaultValue={name} onChange={(e) => setName(e.target.value)}>
                {authors.map((a) => <option key={a.name}>{a.name}</option>)}
              </select>
            </div>
            <div>
          birthyear
              <input
                value={birthyear}
                onChange={({ target }) => setBirthyear(target.value)}
              />
            </div>
            <button type="submit">change birthyear</button>
          </form>
        </>
      ) : (
        null
      )}
    </div>
  )
}

export default Authors
