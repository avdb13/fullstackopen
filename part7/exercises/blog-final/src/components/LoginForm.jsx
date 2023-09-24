import { useState } from 'react'

const LoginForm = ({ newLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()

    newLogin({ username, password })

    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
        username{' '}
          <input
            type="text"
            value={username}
            id="username"
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div>
        password{' '}
          <input
            type="text"
            value={password}
            id="password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit" id="login-button">login</button>
      </form>
    </div>
  )
}

export default LoginForm
