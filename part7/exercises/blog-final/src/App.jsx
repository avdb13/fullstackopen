import { useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Users from './components/Users'
import './app.css'
import { useDispatch, useSelector } from 'react-redux'
import {
  initializeBlogs,
  createBlog,
  likeBlog,
  removeBlog,
} from './reducers/blogReducer'
import { newNotification } from './reducers/notificationReducer'
import { loginUser, autoLoginUser, resetUser } from './reducers/userReducer'
import { Link, Route, Routes } from 'react-router-dom'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    dispatch(autoLoginUser())
  }, [])

  const blogFormRef = useRef()

  const handleLogin = async (credentials) => {
    try {
      dispatch(loginUser(credentials))
      dispatch(newNotification({ content: 'welcome', type: 'message' }, 5000))
    } catch (e) {
      console.log(e)
      e.message === 'Network Error'
        ? dispatch(
          newNotification({
            content: 'backend refused connection',
            type: 'error',
          }),
        )
        : dispatch(
          newNotification(
            { content: 'wrong credentials', type: 'error' },
            5000,
          ),
        )
    }
  }

  const handleCreateBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility()

    try {
      dispatch(createBlog(newBlog))
        .then(() => {
          const content = `${newBlog.title} by ${newBlog.author} was added`
          dispatch(
            newNotification(
              {
                content,
                type: 'message',
              },
              5000,
            ),
          )
        }).catch(() => dispatch(resetUser()))
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

  const handleRemoveBlog = async (id) => {
    try {
      dispatch(removeBlog(id)).catch(() => dispatch(resetUser()))
    } catch (e) {
      console.log(e)
      const { error } = e.response.data

      dispatch(newNotification({ content: error, type: 'error' }, 5000))
    }
  }

  const handleLikeBlog = async (blog) => {
    try {
      dispatch(likeBlog(blog)).then(() => {
        dispatch(
          newNotification(
            { content: `you liked ${blog.title}`, type: 'message' },
            5000,
          ),
        )
      }).catch(() => dispatch(resetUser()))


    } catch (e) {
      dispatch(
        newNotification({ content: e.response.data, type: 'message' }, 5000),
      )
    }
  }

  const handleLogout = async () => {
    dispatch(resetUser())
  }

  const blogList = () => {
    return (
      <ul>
        {[...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              removeBlog={handleRemoveBlog}
              key={blog.id}
              blog={blog}
              username={user.username}
              addLike={handleLikeBlog}
            />
          ))}
      </ul>
    )
  }

  const loginForm = () => {
    return (
      <Togglable buttonLabel="show login form">
        <LoginForm newLogin={handleLogin} />
      </Togglable>
    )
  }

  const blogForm = () => {
    return (
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>
    )
  }

  return (
    <div>
      <Notification />
      <div>
        <Link style={{ padding: 5 }} to="/">home</Link>
        <Link style={{ padding: 5 }} to="/users">users</Link>
      </div>

      {user ? <h2>blogs</h2> : <h2>log in to application</h2>}
      {user ? (
        <div>
          <p>
            {user.name} logged in
          </p>
          <button onClick={handleLogout}>logout</button>
        </div>
      ) : null}

      <Routes>
        <Route path='/' element={user ? blogForm() && blogList() : loginForm() } />
        <Route path='/users' element={<Users />} />
      </Routes>
    </div>
  )
}

export default App
