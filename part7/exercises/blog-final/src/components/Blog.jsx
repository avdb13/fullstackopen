import { useState } from 'react'

const Blog = ({ blog, username, removeBlog, addLike }) => {
  const blogStyle = {
    listStyle: 'none',
    paddingTop: 10,
    paddingLeft: 10,
    border: 'solid',
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 5,
  }

  const [showAll, setShowAll] = useState(false)

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
        {username === blog.user.username ? (
          <button onClick={() => handleRemove(blog)}>remove</button>
        ) : null}
      </div>
    </li>
  )

  return showAll ? fullView() : compactView()
}

export default Blog
