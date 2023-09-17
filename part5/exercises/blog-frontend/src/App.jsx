import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './app.css'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return <div className={message.type}>{message.content}</div>
}

const App = () => {
  const defaultBlog = {title: "", author: "", url: ""};
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState(defaultBlog)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(resp => setBlogs(resp))
  }, [])

  useEffect(() => {
    const userJson = window.localStorage.getItem("blogUser");
    if (userJson) {
      const user = JSON.parse(userJson)

      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("blogUser", JSON.stringify(user));

      blogService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
    } catch(e) {
      setMessage({content: "wrong credentials", type: "error"})
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const handleLogout = async () => {
    window.localStorage.removeItem("blogUser")
    setUser(null)
  }

  const addBlog = async (e) => {
    e.preventDefault()

    try {
      await blogService.create(newBlog)
      setBlogs([...blogs, newBlog])

      setMessage({content: `${newBlog.title} by ${newBlog.author} was added`, type: "message"})
      setTimeout(() => setMessage(null), 5000)
    } catch(e) {
      setMessage({content: e.response.data, type: "error"})
      setTimeout(() => setMessage(null), 5000)
    }

    setNewBlog(defaultBlog)
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

  const blogForm = () => {
    return (
      <form onSubmit={addBlog}>
        <div>
          title:{" "}
          <input type='title' value={newBlog.title} name='Title' onChange={(event) => setNewBlog({...newBlog, title: event.target.value})}/>
        </div>
        <div>
          url:{" "}
          <input type='url' value={newBlog.url} name='Url' onChange={(event) => setNewBlog({...newBlog, url: event.target.value})}/>
        </div>
        <div>
          author:{" "}
          <input type='author' value={newBlog.author} name='Author' onChange={(event) => setNewBlog({...newBlog, author: event.target.value})}/>
        </div>
        <button type='submit'>create</button>
      </form>
    )
  }

  return (
    <div>
      <Notification message={message} />
      {user ? <h2>blogs</h2> : <h2>log in to application</h2>}
      {user ? 
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p> :
          null}
      {user ? blogForm() : null}
      {user ? blogList() : loginForm()}
    </div>
  )
}

export default App
