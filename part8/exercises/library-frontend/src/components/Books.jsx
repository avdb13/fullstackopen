import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Books = ({ show }) => {
  const [filter, setFilter] = useState(null)
  const result = useQuery(ALL_BOOKS)

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>loading ...</div>
  }

  const books = result.data.allBooks
  const genres = [...new Set(books.map((b) => b.genres).flat())]

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
          {filter ? books.filter(b => b.genres.includes(filter)).map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          )) : (
            books.map((b) => (
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
            )
            ))}
        </tbody>
      </table>
      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setFilter(genre)}>
            {genre}
          </button>
        ))}
        <button key='all' onClick={() => setFilter(null)}>all</button>
      </div>
    </div>
  )
}

export default Books
