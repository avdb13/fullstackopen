import { ApolloClient, useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useEffect, useState } from 'react'

const Books = ({ show }) => {
  const [genre, setGenre] = useState(null)
  const genreResult = useQuery(ALL_BOOKS)
  const bookResult = useQuery(ALL_BOOKS, { variables: genre })

  useEffect(() => {
    bookResult.refetch({ genre })
  }, [genre])

  if (!show) {
    return null
  }

  if (bookResult.loading || genreResult.loading) {
    return null
  }

  const genres = [...new Set(genreResult.data.allBooks.map(b => b.genres).flat())]
  const books = bookResult.data.allBooks

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
