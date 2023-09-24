import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { commentBlog } from '../reducers/blogReducer'

const Blog = ({ blog, removeBlog, addLike }) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const [showAll, setShowAll] = useState(false)

  if (!blog) return <div>this blog does not exist anymore!</div>

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

  const handleAddComment = (e) => {
    e.preventDefault()
    const comment = e.target.comment.value
    e.target.comment.value = ''

    console.log(blog, comment)
    dispatch(commentBlog(blog, comment))
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
      <h2>
        {blog.title} by {blog.author}{' '}
        <button onClick={() => setShowAll(false)}>hide</button>
      </h2>
      <div>
        <p><a href={blog.url}>{blog.url}</a></p>
        <p>
          {blog.likes ? blog.likes : 0} likes{' '}
          <button id="like-button" onClick={() => addLike(blog)}>
            like
          </button>
        </p>
        <p>
          added by {blog.user.name}{' '}
          {user ? (user.username === blog.user.username ? (
            <button onClick={() => handleRemove(blog)}>remove</button>
          ) : null) : null}
        </p>
        <h3>comments</h3>
        <ul>
          {blog.comments.map(comment => <li key={comment}>{comment}</li>)}
        </ul>
        <form onSubmit={handleAddComment}>
          <input type='text' name='comment' />
          <button type='submit'>add comment</button>
        </form>
      </div>
    </li>
  )

  return showAll ? fullView() : compactView()
}

export default Blog
