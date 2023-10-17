import { useEffect, useRef, useState } from 'react'
import UserBlogs from './components/UserBlogs'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Users from './components/Users'
import { useDispatch, useSelector } from 'react-redux'
import {
  initializeBlogs,
  createBlog,
  likeBlog,
  removeBlog,
} from './reducers/blogReducer'
import { newNotification } from './reducers/notificationReducer'
import { loginUser, autoLoginUser, resetUser } from './reducers/userReducer'
import { Link, Navigate, Route, Routes, redirect, useMatch } from 'react-router-dom'
import userService from './services/users'

const App = () => {
  const dispatch = useDispatch()
  const [users, setUsers] = useState(null)
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

  useEffect(() => {
    userService.getAll().then((users) => setUsers(users))
  }, [])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    dispatch(autoLoginUser())
  }, [])

  const blogFormRef = useRef()

  const handleLogin = async (credentials) => {
    dispatch(loginUser(credentials))
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
        })
        .catch(() => dispatch(resetUser()))
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
      dispatch(likeBlog(blog))
        .then(() => {
          dispatch(
            newNotification(
              { content: `you liked ${blog.title}`, type: 'message' },
              5000,
            ),
          )
        })
        .catch(() => dispatch(resetUser()))
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
      <div>
        <h2>blogs</h2>
        <ul>
          {blogs
            // .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                removeBlog={handleRemoveBlog}
                key={blog.id}
                blog={blog}
                addLike={handleLikeBlog}
              />
            ))}
        </ul>
      </div>
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

  const blogMatch = useMatch('/blogs/:id')
  const userMatch = useMatch('/users/:id')

  const matchBlog = blogMatch
    ? blogs.find((b) => b.id === blogMatch.params.id)
    : null
  const matchUser = userMatch
    ? users.find((u) => u.id === userMatch.params.id)
    : null

  const linkStyle = 'p-2 text-grey-dark border-b-2 text-xs border-white mx-4 hover:scale-110 hover:border-indigo-500 transition'

  return (
    <div>
      <div className="uppercase font-bold px-1 shadow-md flex -mb-px">
        <Link to="/" className={linkStyle}>home</Link>
        <Link to="/blogs" className={linkStyle}>blogs</Link>
        <Link to="/users" className={linkStyle}>users</Link>
        {user ? (
          <a className={linkStyle} onClick={handleLogout}>logout {user.name}</a>
        ) : (
          <Link to="/login" className={linkStyle}>login</Link>
        )}
      </div>
      <Notification />
      <Routes>
        <Route
          path="/"
          element={
            <h1 className="text-3xl font-bold p-4">Welcome to my blog app!</h1>
          }
        />
        <Route path="/blogs" element={blogList()} />
        <Route path="/login" element={loginForm()} />
        <Route path="/users" element={<Users users={users} />} />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={matchBlog}
              addLike={handleLikeBlog}
              removeBlog={handleRemoveBlog}
            />
          }
        />
        <Route path="/users/:id" element={<UserBlogs user={matchUser} />} />
      </Routes>
    </div>
  )
}

export default App
