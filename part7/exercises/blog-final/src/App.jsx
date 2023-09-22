import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import './app.css'
import { useDispatch, useSelector } from 'react-redux'
import {
  newNotification,
} from './reducers/notificationReducer'

const Notification = () => {
  const message = useSelector((state) => state.notification)
  if (message === null) {
    return null
  }
  return <div className={message.type}>{message.content}</div>
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    blogService.getAll().then((resp) => setBlogs(resp))
  }, [])

  useEffect(() => {
    const userJson = window.localStorage.getItem('blogUser')
    if (userJson) {
      const user = JSON.parse(userJson)

      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const newLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem('blogUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      dispatch(newNotification({ content: 'welcome', type: 'message' }, 5000))
    } catch (e) {
      e.message === 'Network Error'
        ? dispatch(
          newNotification({
            content: 'backend refused connection',
            type: 'error',
          }),
        )
        : dispatch(
          newNotification({ content: 'wrong credentials', type: 'error' }, 5000),
        )
    }
  }

  const createBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility()

    try {
      await blogService.create(newBlog)
      setBlogs([...blogs, newBlog])

      dispatch(
        newNotification(
          {
            content: `${newBlog.title} by ${newBlog.author} was added`,
            type: 'message',
          },
          5000,
        ),
      )
    } catch (e) {
      dispatch(
        newNotification(
          {
            content: e.response.data,
            type: 'error',
          },
          5000,
        ),
      )
    }
  }

  const removeBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter((blog) => blog.id !== id))
    } catch (e) {
      console.log(e)
      const { error } = e.response.data

      dispatch(newNotification({ content: error, type: 'error' }, 5000))
    }
  }

  const addLike = async (blog) => {
    try {
      const newBlog = await blogService.update(blog)
      setBlogs(blogs.map((blog) => (blog.id === newBlog.id ? newBlog : blog)))

      dispatch(
        newNotification(
          { content: `you liked ${newBlog.title}`, type: 'message' },
          5000,
        ),
      )
    } catch (e) {
      dispatch(
        newNotification({ content: e.response.data, type: 'message' }, 5000),
      )
    }
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('blogUser')
    setUser(null)
  }

  const blogList = () => {
    return (
      <ul>
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              removeBlog={removeBlog}
              key={blog.id}
              blog={blog}
              username={user.username}
              addLike={addLike}
            />
          ))}
      </ul>
    )
  }

  const loginForm = () => {
    return (
      <Togglable buttonLabel="show login form">
        <LoginForm newLogin={newLogin} />
      </Togglable>
    )
  }

  const blogForm = () => {
    return (
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
    )
  }

  return (
    <div>
      <Notification />
      {user ? <h2>blogs</h2> : <h2>log in to application</h2>}
      {user ? (
        <p>
          {user.name} logged in <button onClick={handleLogout}>logout</button>
        </p>
      ) : null}
      {user ? blogForm() : null}
      {user ? blogList() : loginForm()}
    </div>
  )
}

export default App
