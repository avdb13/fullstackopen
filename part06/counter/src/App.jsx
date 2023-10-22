import { useContext } from 'react'
import CounterContext  from './CounterContext'
import Display from './components/Display'
import Button from './components/Button'

function App() {
  return (
      <div>
        <Display />
        <div>
          <Button label='-' type='DEC' />
          <Button label='0' type='ZERO' />
          <Button label='+' type='INC' />
        </div>
      </div>
  )
}

export default App
