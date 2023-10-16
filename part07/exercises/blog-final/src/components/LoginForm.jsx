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

  const inputStyle = 'peer placeholder-transparent border-b-2 focus:outline-none text'
  const labelStyle = 'relative text-grey-600 transition-all text-xs -top-12 peer-placeholder-shown:-top-6 peer-placeholder-shown:text-base peer-focus:-top-12 peer-focus:text-xs'
  const inputBoxStyle = 'p-2'
  const buttonStyle = 'bg-indigo-500 rounded-md py-2 w-24 -left-2 text-white text-sm hover:bg-indigo-600 ease-in-out duration-200'

  return (
    <div>
      <h2 className='text-3xl font-bold p-4'>log in to application</h2>
      <form className='flex-initial flex-col w-64 p-4 column shrink-1 border-solid border-2 rounded-xl' onSubmit={handleLogin}>
        <div className={inputBoxStyle}>
          <input
            className={inputStyle}
            placeholder='username'
            type="text"
            value={username}
            id="username"
            onChange={(event) => setUsername(event.target.value)}
          />
          <label htmlFor='username' className={labelStyle}>username{' '}</label>
        </div>
        <div className={inputBoxStyle}>
          <input
            className={inputStyle}
            type="password"
            value={password}
            placeholder='password'
            id="password"
            onChange={(event) => setPassword(event.target.value)}
          />
          <label htmlFor='password' className={labelStyle}>password{' '}</label>
        </div>
        <button className={buttonStyle} type="submit" id="login-button">login</button>
      </form>
    </div>
  )
}

export default LoginForm
