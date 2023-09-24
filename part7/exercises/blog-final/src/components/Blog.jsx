import { useState } from 'react'
import { useSelector } from 'react-redux'

const Blog = ({ blog, removeBlog, addLike }) => {
  const user = useSelector(state => state.user)
  const [showAll, setShowAll] = useState(false)

  if (!blog) return <div>this blog doesn't exist anymore!</div>

  const blogStyle = {
    listStyle: 'none',
    paddingTop: 10,
    paddingLeft: 10,
    border: 'solid',
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 5,
  }


  const handleRemove = () => {
    if (window.confirm(`remove ${blog.title} by ${blog.author}?`)) {
      removeBlog(blog.id)
    }
  }

  const compactView = () => (
    <li key={blog.id} style={blogStyle}>
      <p>
        <a href={blog.url}>{blog.title}</a> by {blog.author}{' '}
        <button onClick={() => setShowAll(true)}>show</button>
      </p>
    </li>
  )

  const fullView = () => (
    <li key={blog.id} style={blogStyle}>
      <p>
        {blog.title} by {blog.author}
        <button onClick={() => setShowAll(false)}>hide</button>
      </p>
      <div>
        <p>{blog.url}</p>
        <p>
          {blog.likes ? blog.likes : 0} likes{' '}
          <button id="like-button" onClick={() => addLike(blog)}>
            like
          </button>
        </p>
        <p>added by {blog.user.name}</p>
        {user ? (user.username === blog.user.username ? (
          <button onClick={() => handleRemove(blog)}>remove</button>
        ) : null) : null}
      </div>
    </li>
  )

  return showAll ? fullView() : compactView()
}

export default Blog
