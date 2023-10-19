import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { commentBlog } from '../reducers/blogReducer'

const Blog = ({ blog, removeBlog, addLike }) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const [showAll, setShowAll] = useState(false)

  if (!blog) return <div>this blog does not exist anymore!</div>

  // const blogStyle = {
  //   listStyle: 'none',
  //   paddingTop: 10,
  //   paddingLeft: 10,
  //   border: 'solid',
  //   borderWidth: 2,
  //   borderRadius: 5,
  //   marginBottom: 5,
  // }
  const blogStyle = 'relative mx-4 my-2 gap-2 p-2 max-w-md flex flex-shrink flex-wrap justify-between bg-white shadow-sm ring-2 ring-purple-300 rounded'
  const gradient = 'absolute mx-4 blur -inset-0 max-w-md transition absolute bg-gradient-to-r from-sky-400 to-indigo-400 opacity-25'
  const buttonStyle = 'shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none font-bold rounded text-white py-1 px-4 m-2'


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
    <div>
      <li key={blog.id} className="relative group">
        <div className={gradient}></div>
        <div className={blogStyle}>
          <a className='basis-1/2 text-xl font-semibold text-gray-600' href={blog.url}>{blog.title}</a>
          <p className='basis-1/2 text-xs'>by {blog.author}</p>
          <button className={buttonStyle} onClick={() => setShowAll(true)}>show</button>
        </div>
      </li>
    </div>
  )

  const fullView = () => (
    <li key={blog.id} className={blogStyle}>
      <h2>
        {blog.title} by {blog.author}{' '}
        <button onClick={() => setShowAll(false)}>hide</button>
      </h2>
      <div>
        <p><a href={blog.url}>{blog.url}</a></p>
        <p>
          {blog.likes ? blog.likes : 0} likes{' '}
          <button className={buttonStyle} id="like-button" onClick={() => addLike(blog)}>
            like
          </button>
        </p>
        <p>
          added by {blog.user.name}{' '}
          {user ? (user.username === blog.user.username ? (
            <button className={buttonStyle} onClick={() => handleRemove(blog)}>remove</button>
          ) : null) : null}
        </p>
        <h3>comments</h3>
        <ul>
          {blog.comments.map(comment => <li key={comment}>{comment}</li>)}
        </ul>
        <form onSubmit={handleAddComment}>
          <input type='text' name='comment' />
          <button className={buttonStyle} type='submit'>add comment</button>
        </form>
      </div>
    </li>
  )

  return showAll ? fullView() : compactView()
}

export default Blog
