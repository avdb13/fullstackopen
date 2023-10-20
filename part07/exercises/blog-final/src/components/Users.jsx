import { Link } from 'react-router-dom'

const Users = ({ users }) => {
  if (!users) return <div>loading ...</div>

  const cellStyle = 'basis-1/3 m-2 whitespace-nowrap text-center'

  return (
    <div>
      <h1 className="text-3xl font-bold p-4">Users</h1>
      <table className="table-auto w-[600px] border-2 border-indigo-100 mx-4 my-2 p-2">
        <thead className="text-xs font-semibold uppercase text-zinc-400 bg-indigo-50">
          <tr className='flex justify-evenly'>
            <th className={cellStyle}>username</th>
            <th className={cellStyle}>full name</th>
            <th className={cellStyle}>blogs</th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-indigo-100 text-zinc-600 text-sm [&>*:nth-child(even)]:bg-indigo-50">
          {users.map((user) => (
            <tr key={user.id} className='flex justify-evenly'>
              <td className={cellStyle}>
                <Link to={`/users/${user.id}`}>{user.username}</Link>
              </td>
              <td className={cellStyle}>{user.name}</td>
              <td className={cellStyle}>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
