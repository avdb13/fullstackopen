import { useEffect, useState } from 'react'
import userService from '../services/users'

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    userService.getAll().then(users => {
      console.log(users)
      setUsers(users)
    })
  }, [])

  return (
    <div>
      <h1>Users</h1>
      <table>
        <tbody>
          <tr>
            <td></td>
            <td><strong>blogs created</strong></td>
          </tr>
          {users.map(user => <tr key={user.id}><td>{user.name}</td><td>{user.blogs.length}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}

export default Users
