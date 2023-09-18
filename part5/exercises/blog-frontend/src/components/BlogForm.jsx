import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const defaultBlog = { title: '', author: '', url: '' }
  const [newBlog, setNewBlog] = useState(defaultBlog)

  const handleCreateBlog = (event) => {
    event.preventDefault()

    createBlog(newBlog)

    setNewBlog(defaultBlog)
  }

  return (
    <form onSubmit={handleCreateBlog} className="form">
      <div>
        title:{' '}
        <input
          type="title"
          placeholder="title"
          value={newBlog.title}
          name="Title"
          onChange={(event) =>
            setNewBlog({ ...newBlog, title: event.target.value })
          }
        />
      </div>
      <div>
        url:{' '}
        <input
          type="url"
          placeholder="url"
          value={newBlog.url}
          name="Url"
          onChange={(event) =>
            setNewBlog({ ...newBlog, url: event.target.value })
          }
        />
      </div>
      <div>
        author:{' '}
        <input
          type="author"
          placeholder="author"
          value={newBlog.author}
          name="Author"
          onChange={(event) =>
            setNewBlog({ ...newBlog, author: event.target.value })
          }
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm
