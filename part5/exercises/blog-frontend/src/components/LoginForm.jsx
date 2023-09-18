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

export default LoginForm
