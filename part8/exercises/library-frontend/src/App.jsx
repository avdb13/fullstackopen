import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

const Notification = ({ message }) => message === null ? (
  null
) : (
  <div style={{ color: 'orangered' }}>{message}</div>
)

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)

  const handleError = (message) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), 5000)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Notification message={errorMessage} />
      <Authors show={page === 'authors'} setError={handleError} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} setError={handleError} />
    </div>
  )
}

export default App
