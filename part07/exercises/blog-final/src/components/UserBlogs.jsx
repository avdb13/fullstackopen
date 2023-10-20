import { Link } from 'react-router-dom'

const UserBlogs = ({ user }) => {
  // useMatch will race with useEffect
  if (!user) return <div>loading ...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold p-4">{user.name}</h1>
      <h2 className="text-lg p-4 font-extralight">added blogs</h2>
      {user.blogs.length > 0 ? (
        <ul className="p-4 flex flex-col divide-y  w-96">
          {user.blogs.map((blog) => (
            <li className="py-2 text-slate-600 font-bold" key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className='p-4'>{user.name} has no blogs yet!</p>
      )}
    </div>
  )
}

export default UserBlogs
