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

  const inputStyle = 'w-2/3 bg-gray-200 border-2 border-gray-300 rounded py-1 px-2 mx-4 appearance-none focus:outline-none focus:bg-white focus:border-purple-500'
  const labelStyle = 'w-1/3 block text-gray-500 font-bold text-right px-2'
  const inputBoxStyle = 'flex flex-initial my-1 items-center'

  return (
    <div>
      <h2 className='text-3xl font-bold p-4'>log in to application</h2>
      <form id="loginForm" className='w-fit flex flex-col w-48 py-2 mx-4 border-2 focus:outline-none' onSubmit={handleLogin}>
        <div className={inputBoxStyle}>
          <label htmlFor='username' className={labelStyle}>username{' '}</label>
          <input
            className={inputStyle}
            type="text"
            value={username}
            id="username"
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className={inputBoxStyle}>
          <label htmlFor='password' className={labelStyle}>password{' '}</label>
          <input
            className={inputStyle}
            type="password"
            value={password}
            id="password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
      </form>
    </div>
  )
}

export default LoginForm
