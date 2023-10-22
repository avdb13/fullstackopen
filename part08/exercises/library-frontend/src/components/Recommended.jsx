import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

const Recommended = ({ show }) => {
  const bookResult = useQuery(ALL_BOOKS)
  const userResult = useQuery(ME)

  if (!show) {
    return null
  }

  if (bookResult.loading || userResult.loading) {
    return <div>loading ...</div>
  }

  console.log(userResult)
  const books = bookResult.data.allBooks
  const user = userResult.data.me

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <strong>pattern</strong></p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.filter(b => b.genres.includes(user.favoriteGenre)).map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          )
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended
