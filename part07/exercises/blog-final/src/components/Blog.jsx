import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { commentBlog } from '../reducers/blogReducer'
import Comment from '../components/Comment'

const Blog = ({ blog, removeBlog, addLike }) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const [showAll, setShowAll] = useState(false)

  if (!blog) return <div>this blog does not exist anymore!</div>

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

  const blogStyle = 'relative mx-4 my-2 p-2 max-w-md bg-white shadow-sm ring-2 ring-purple-300 rounded'
  const flexStyle = 'flex flex-shrink place-items-center flex-wrap justify-between'
  const gradient = 'absolute mx-4 my-2 blur -inset-0 max-w-md transition absolute bg-gradient-to-r from-indigo-400 to-purple-400 opacity-10 group-hover:opacity-50'
  const buttonStyle = 'shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none font-bold rounded text-white py-1 px-4 m-2'
  const likeStyle = 'flex justify-center m-1 rounded-full'


  const compactView = () => (
    <div key={blog.id} className="relative group">
      <div className={gradient}></div>
      <div className={blogStyle + ' ' + flexStyle}>
        <a className='basis-1/2 text-xl font-semibold text-gray-600' href={blog.url}>{blog.title}</a>
        <button className={buttonStyle} onClick={() => setShowAll(true)}>show</button>
        <p className='basis-1/2 text-xs'>by {blog.author}</p>
      </div>
    </div>
  )

  const fullView = () => (
    <li key={blog.id} className="relative group">
      <div className={gradient}></div>
      <div className={blogStyle}>
        <div className={flexStyle}>
          <h2 className='basis-1/2 text-xl font-semibold text-gray-600'>
            {blog.title}
          </h2>
          <button className={buttonStyle} onClick={() => setShowAll(false)}>hide</button>
          <h2 className='basis-1/2 text-xs'>
           by {blog.author}{' '}
          </h2>
        </div>
        <div className={flexStyle}>
          <div className='pt-4'>
            <a className='text-violet-900 hover:text-violet-700 font-thin' href={blog.url}>{blog.url}</a>
            <p className='basis-1/2 text-xs'>
            added by {blog.user.name}{' '}
              {user ? (user.username === blog.user.username ? (
                <button className={buttonStyle} onClick={() => handleRemove(blog)}>remove</button>
              ) : null) : null}
            </p>
            <div className='flex flex-initial items-center py-2'>
              <p>
                {blog.likes ? blog.likes : 0} likes{' '}
              </p>
              <button className={buttonStyle} id="like-button" onClick={() => addLike(blog)}>
            like
              </button>
            </div>
          </div>
        </div>
        <div>
          <h3>comments</h3>
          <ul className='w-full'>
            {blog.comments.map(comment => <Comment key={comment._id} comment={comment} />)}
          </ul>
          <form onSubmit={handleAddComment} className={flexStyle}>
            <input type='text' name='comment' className="grow py-1 text-center rounded focus:-border-1 bg-slate-100" />
            <button className={buttonStyle} type='submit'>add comment</button>
          </form>
        </div>
      </div>
    </li>
  )

  return showAll ? fullView() : compactView()
}

export default Blog
