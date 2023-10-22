import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { commentBlog } from '../reducers/blogReducer'
import Comment from '../components/Comment'

const Blog = ({ blog, removeBlog, addLike }) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.users.me)
  const [showAll, setShowAll] = useState(false)

  if (!blog) return <div>this blog does not exist anymore!</div>

  const handleRemove = () => {
    if (window.confirm(`remove ${blog.title} by ${blog.author}?`)) {
      removeBlog(blog.id)
    }
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    const body = e.target.comment.value
    e.target.comment.value = ''
    dispatch(commentBlog(blog.id, body))
  }

  const blogStyle =
    'relative mx-4 my-2 p-2 max-w-md bg-white shadow-sm ring-2 ring-purple-300 rounded pb-4'
  const flexStyle =
    'flex flex-shrink place-items-center flex-wrap justify-between'
  const gradient =
    'absolute mx-4 my-2 blur -inset-0 max-w-md transition absolute bg-gradient-to-r from-indigo-400 to-purple-400 opacity-10 group-hover:opacity-50'
  const buttonStyle =
    'transition-all bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none font-bold rounded text-white py-1 px-4 m-2'

  const compactView = () => (
    <div key={blog.id} className="relative group list-none">
      <div className={gradient}></div>
      <div className={blogStyle + ' ' + flexStyle}>
        <a
          className="basis-1/2 text-xl font-semibold text-gray-600 whitespace-nowrap"
          href={blog.url}
        >
          {blog.title}
        </a>
        <button className={buttonStyle} onClick={() => setShowAll(true)}>
          show
        </button>
        <p className="basis-1/2 text-xs">by {blog.author}</p>
      </div>
    </div>
  )

  const fullView = () => (
    <li key={blog.id} className="relative group list-none">
      <div className={gradient}></div>
      <div className={blogStyle}>
        <div className={flexStyle}>
          <h2 className="basis-1/2 text-xl font-semibold text-gray-600 whitespace-nowrap">
            {blog.title}
          </h2>
          <button className={buttonStyle} onClick={() => setShowAll(false)}>
            hide
          </button>
          <h2 className="basis-1/2 text-xs">by {blog.author} </h2>
        </div>
        <div className={flexStyle}>
          <div className="pt-4">
            <p className="text-violet-900 hover:text-violet-700 font-thin truncate max-w-sm">
              <a
                href={blog.url}
              >
                {blog.url}
              </a>
            </p>
            <p className="basis-1/2 text-xs">
              added by {blog.user.name}{' '}
              {user ? (
                user.username === blog.user.username ? (
                  <button
                    className={buttonStyle}
                    onClick={() => handleRemove(blog)}
                  >
                    remove
                  </button>
                ) : null
              ) : null}
            </p>
            <div className="flex flex-initial items-center py-2">
              <p>{blog.likes ? blog.likes : 0} likes </p>
              <button
                className={buttonStyle}
                id="like-button"
                onClick={() => addLike(blog)}
              >
                like
              </button>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-600 pt-4">comments</h3>
          <form onSubmit={handleAddComment} className={flexStyle}>
            <input
              type="text"
              name="comment"
              className="grow py-1 text-center rounded focus:outline-none focus:-border-1 bg-slate-100"
            />
            <button className={buttonStyle} type="submit">
              add comment
            </button>
          </form>
          <ul className="w-full [&>*:not(:last-child)]:border-b-2 [&>*]:m-2">
            {[...blog.comments]
              .sort((a, b) => new Date(b.added) - new Date(a.added))
              .map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))}
          </ul>
        </div>
      </div>
    </li>
  )

  return showAll ? fullView() : compactView()
}

export default Blog
