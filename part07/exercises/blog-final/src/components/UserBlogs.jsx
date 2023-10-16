import { Link } from 'react-router-dom'

const UserBlogs = ({ user }) => {
  // useMatch will race with useEffect
  if (!user) return <div>loading ...</div>

  return (
    <div>
      <h1>{user.name}</h1>
      <h2>added blogs</h2>
      <ul>
        {user.blogs.map(blog => <li key={blog.id}><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></li>)}
      </ul>
    </div>
  )
}

export default UserBlogs
