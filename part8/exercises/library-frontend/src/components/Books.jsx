import { ApolloClient, useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useEffect, useState } from 'react'

const Books = ({ show }) => {
  const [genres, setGenres] = useState([])
  const [genre, setGenre] = useState(null)
  const result = useQuery(ALL_BOOKS, { variables: genre })

  useEffect(() => {
    if (!result.previousData && result.data) {
      setGenres([...new Set(result.data.allBooks.map(b => b.genres).flat())])
    }
  }, [result])

  useEffect(() => {
    result.refetch({ genre })
  }, [genre])

  if (!show) {
    return null
  }

  const books = result.loading ? result.previousData.allBooks : result.data.allBooks

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setGenre(genre)}>
            {genre}
          </button>
        ))}
        <button key="all" onClick={() => setGenre(null)}>
          all
        </button>
      </div>
    </div>
  )
}

export default Books
