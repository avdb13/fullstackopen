import PropTypes from 'prop-types'
import { useState } from 'react'

const LoginForm = ({
  newLogin
}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    newLogin({ username, password })

    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        username{' '}
        <input
          value={username}
          id='username'
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>
      <div>
        password{' '}
        <input
          type='password'
          value={password}
          id='password'
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <button type='submit' id='login-button'>login</button>
    </form>
  )
}

LoginForm.propTypes = {
  newLogin: PropTypes.func.isRequired
}

export default LoginForm
