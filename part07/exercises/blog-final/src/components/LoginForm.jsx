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

  const inputStyle = 'w-2/3 bg-gray-200 border-2 border-gray-300 rounded w-48 py-1 px-2 appearance-none focus:outline-none focus:bg-white focus:border-purple-500'
  const labelStyle = 'w-1/3 block text-gray-500 font-bold text-right mb-1 pr-4'
  const inputBoxStyle = 'w-128 flex flex-initial mb-6 items-center'

  return (
    <div>
      <h2 className='text-3xl font-bold p-4'>log in to application</h2>
      <form className='flex flex-col w-96 p-4 m-4 border-2 mb-2 focus:outline-none' onSubmit={handleLogin}>
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
        <div className="flex flex-start">
          <button className='w-1/3 shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none font-bold rounded text-white py-1' type="submit" id="login-button">login</button>
          <div className='w-2/3'></div>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
