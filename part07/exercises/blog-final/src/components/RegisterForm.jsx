import { useField } from '../hooks/useField'
import registerService from '../services/register'

const RegisterForm = () => {
  const username = useField('text')
  const name = useField('text')
  const password = useField('text')

  const handleRegister = async () => {
    try {
      await registerService.register({ name, username, password })
    } catch(e) {
      console.log(e)
    }
  }

  return (
    <form onSubmit={handleRegister}>
      <div>
        username{' '}
        <input
          id="username"
          {...username}
        />
      </div>
      <div>
        name{' '}
        <input
          id="name"
          {...name}
        />
      </div>
      <div>
        password{' '}
        <input
          id="password"
          {...password}
        />
      </div>
      <button type="submit" id="login-button">login</button>
    </form>
  )
}

export default RegisterForm
