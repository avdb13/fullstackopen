import { useState } from 'react'
import style from '../styles'

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
      <h2 className='text-3xl font-bold p-4'>log in to application</h2>
      <form className={style.form} onSubmit={handleLogin}>
        <div className={style.inputBox}>
          <input
            className={style.input}
            placeholder='username'
            type="text"
            value={username}
            id="username"
            onChange={(event) => setUsername(event.target.value)}
          />
          <label htmlFor='username' className={style.label}>username{' '}</label>
        </div>
        <div className={style.inputBox}>
          <input
            className={style.input}
            type="password"
            value={password}
            placeholder='password'
            id="password"
            onChange={(event) => setPassword(event.target.value)}
          />
          <label htmlFor='password' className={style.label}>password{' '}</label>
        </div>
        <div>
          <button className={style.button} type="submit" id="login-button">login</button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
