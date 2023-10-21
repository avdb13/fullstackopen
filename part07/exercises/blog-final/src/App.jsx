import { useEffect, useRef } from 'react'
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
import { loginUser, autoLoginUser, resetUser, initializeUsers } from './reducers/usersReducer'
import { Link, Route, Routes, useMatch, useNavigate } from 'react-router-dom'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const users = useSelector((state) => state.users.all)
  const user = useSelector((state) => state.users.me)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(initializeUsers())
    dispatch(initializeBlogs())
    dispatch(autoLoginUser())
  }, [])

  const blogFormRef = useRef()

  const handleLogin = async (credentials) => {
    dispatch(loginUser(credentials, () => navigate('/blogs')))
  }

  const handleCreateBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(newBlog))
  }

  const handleRemoveBlog = async (id) => {
    dispatch(removeBlog(id))
  }

  const handleLikeBlog = async (blog) => {
    dispatch(likeBlog(blog.id, blog.title))
  }

  const handleLogout = async () => {
    dispatch(resetUser())
    navigate('/login')
  }

  const blogList = () => {
    return (
      <div>
        <h2 className="text-3xl font-bold p-4">blogs</h2>
        <ul className="flex flex-col">
          {[...blogs]
            .sort((a, b) => b.likes - a.likes)
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

  const linkStyle =
    'p-2 text-grey-dark border-b-2 text-xs border-white mx-4 hover:scale-110 hover:border-indigo-500 transition'

  return (
    <div className="font-quicksand font-semibold text-gray-700">
      <div className="uppercase font-bold px-1 shadow-md flex -mb-px">
        <Link to="/" className={linkStyle}>
          home
        </Link>
        <Link to="/blogs" className={linkStyle}>
          blogs
        </Link>
        <Link to="/users" className={linkStyle}>
          users
        </Link>
        {user ? (
          <a className={linkStyle} onClick={handleLogout}>
            logout {user.name}
          </a>
        ) : (
          <Link to="/login" className={linkStyle}>
            login
          </Link>
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
            <div className='flex flex-col py-4'>
              <Blog
                blog={matchBlog}
                addLike={handleLikeBlog}
                removeBlog={handleRemoveBlog}
              />
            </div>
          }
        />
        <Route path="/users/:id" element={<UserBlogs user={matchUser} />} />
      </Routes>
    </div>
  )
}

export default App
