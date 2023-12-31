import { useEffect, useState } from 'react'
import { BOOK_ADDED, ALL_BOOKS } from './queries'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommended'
import { useApolloClient, useSubscription } from '@apollo/client'

const Notification = ({ message }) =>
  message === null ? null : <div style={{ color: 'orangered' }}>{message}</div>

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const book = data.data.bookAdded
      const unique = (arr) => [...new Set(arr)]
      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => ({
        allBooks: [...unique(allBooks), book],
      }))
    },
  })

  useEffect(() => {
    const auth = localStorage.getItem('libraryToken')
    if (auth) {
      setToken(auth)
    }
  }, [])

  const handleError = (message) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), 5000)
  }

  const logout = () => {
    localStorage.removeItem('libraryToken')
    setToken(null)
    client.clearStore()
    setPage('login')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage('recommended')}>recommended</button>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Notification message={errorMessage} />
      <Authors show={page === 'authors'} setError={handleError} token={token} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} setError={handleError} />
      <Recommended show={page === 'recommended'} setError={handleError} />
      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setError={handleError}
        setPage={setPage}
      />
    </div>
  )
}

export default App
