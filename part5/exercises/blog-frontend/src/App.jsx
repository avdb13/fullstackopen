import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './app.css'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return <div className='error'>{message}</div>
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(resp => setBlogs(resp))
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password });

      blogService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
    } catch(e) {
      console.log(e)
      setErrorMessage("wrong credentials")
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const blogList = () => {
    return (
      <ul>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </ul>
    )
  }

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <div>
          username <input type='text' value={username} name='Username' onChange={(event) => setUsername(event.target.value)}/>
        </div>
        <div>
          password <input type='text' value={password} name='Password' onChange={(event) => setPassword(event.target.value)}/>
        </div>
        <button type='submit'>login</button>
      </form>
    )
  }

  return (
    <div>
      <Notification message={errorMessage} />
      {user ? <h2>blogs</h2> : <h2>log in to application</h2>}
      {user ? blogList() : loginForm()}
    </div>
  )
}

export default App
