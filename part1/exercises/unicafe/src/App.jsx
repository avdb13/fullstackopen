import { useState } from 'react'

const Header = ({ title }) => <h1>{title}</h1>

const Button = ({ text, handleClick }) => <button onClick={handleClick}>{text}</button>

const StatisticLine = ({ text, value }) => <p>{text} {value}</p>

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [average, setAverage] = useState(0)

  const handleGood = () => {
    const updated = good+1
    setGood(updated)
    setAverage(average+1)
  }
  const handleNeutral = () => {
    const updated = neutral+1
    setNeutral(updated)
    setAverage(average+0)
  }
  const handleBad = () => {
    const updated = bad+1
    setBad(updated)
    setAverage(average-1)
  }

  const total = good + neutral + bad;
  const positive = good / total * 100;


  return (
    <div>
    <Header title='give feedback' />

    <Button handleClick={handleGood} text='good' />
    <Button handleClick={handleNeutral} text='neutral' />
    <Button handleClick={handleBad} text='bad' />

    <Header title='statistics' />
    {
      total === 0 ? (
        <p>no statistics available yet!</p>
      ) : (
        <div>
          <StatisticLine text='good' value={good} />
          <StatisticLine text='neutral' value={neutral} />
          <StatisticLine text='bad' value={bad} />
          <StatisticLine text='total' value={total} />
          <StatisticLine text='average' value={average / total} />
          <StatisticLine text='positive' value={positive + ' %'} />
        </div>
      )
    }
    </div>
  )
}

export default App
