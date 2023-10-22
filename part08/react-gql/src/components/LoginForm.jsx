import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setError, setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, result] = useMutation(LOGIN, {
    onError: (e) => setError(e.graphQLErrors.map(e => e.message).join('\n'))
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('token', token)
    }
  }, [result.data])

  const submit = (e) => {
    e.preventDefault()

    login({ variables: { username, password } })
  }

  return (
    <div>
    <h2>Login</h2>
    <form onSubmit={submit}>
      <div>username <input value={username} onChange={e => setUsername(e.target.value)}/></div>
      <div>password <input type='password' value={password} onChange={e => setPassword(e.target.value)}/></div>
      <button onSubmit={submit}>login</button>
    </form>
    </div>
  )
}

export default LoginForm
