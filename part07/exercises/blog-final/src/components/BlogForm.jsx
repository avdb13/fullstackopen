import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'

const BlogForm = () => {
  const dispatch = useDispatch()
  const [showAll, setShowAll] = useState(false)

  const defaultBlog = { title: '', author: '', url: '' }
  const [newBlog, setNewBlog] = useState(defaultBlog)

  const handleCreateBlog = (event) => {
    event.preventDefault()

    dispatch(createBlog(newBlog))

    setNewBlog(defaultBlog)
  }

  const blogStyle = 'mx-4 bg-white mb-4 '
  const inputStyle =
    'bg-gray-200 rounded focus:outline-none focus:-border-1 bg-slate-100 text-center'
  const labelStyle = 'block w-24'
  const fieldStyle = 'flex flex-row'

  return (
    <form onSubmit={handleCreateBlog} id="blogForm" className={blogStyle}>
      <div className="flex flex-col gap-2">
        <div className={fieldStyle}>
          <label className={labelStyle}>title </label>
          <input
            type="title"
            id="title"
            className={inputStyle}
            value={newBlog.title}
            name="Title"
            onChange={(event) =>
              setNewBlog({ ...newBlog, title: event.target.value })
            }
          />
        </div>
        <div className={fieldStyle}>
          <label className={labelStyle}>URL </label>
          <input
            type="url"
            id="url"
            className={inputStyle}
            value={newBlog.url}
            name="Url"
            onChange={(event) =>
              setNewBlog({ ...newBlog, url: event.target.value })
            }
          />
        </div>
        <div className={fieldStyle}>
          <label className={labelStyle}>author </label>
          <input
            type="author"
            id="author"
            className={inputStyle}
            value={newBlog.author}
            name="Author"
            onChange={(event) =>
              setNewBlog({ ...newBlog, author: event.target.value })
            }
          />
        </div>
      </div>
    </form>
  )
}

export default BlogForm
