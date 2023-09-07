import { useState } from 'react'

const Header = ({ title }) => <h1>{title}</h1>

const Button = ({ text, handleClick }) => <button onClick={handleClick}>{text}</button>

const Statistics = ({ texts, feedbacks, average }) => {
  const NoFeedback = feedbacks.reduce((acc, next) => acc && (next === 0), true)

  // note: this solution is not idiomatic as clicking [good, bad, neutral] will trigger this condition
  // if (average === 0) {
  //     return <p>no statistics available yet!</p>
  // } 

  if (NoFeedback) {
      return <p>no statistics available yet!</p>
  } 

  const zipped = feedbacks.map((feedback, i) => [texts[i], feedback])
  const mapped = zipped.map(([text, feedback]) => <p>{text} {feedback}</p>)

  const positive = feedbacks[0];
  const totalFeedback = feedbacks.reduce((acc, next) => acc+=next, 0)

  // it is generally disadvised to use array indices without describing their value
  return (
    <>
      <div>{mapped}</div>
      <p>average {average / totalFeedback}</p>
      <p>positive {positive / totalFeedback} %</p>
    </>
  )
}

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

  return (
    <div>
     <Header title='give feedback' />

     <Button handleClick={handleGood} text='good' />
     <Button handleClick={handleNeutral} text='neutral' />
     <Button handleClick={handleBad} text='bad' />

     <Header title='statistics' />
     <Statistics texts={['good', 'neutral', 'bad']} feedbacks={[good, neutral, bad]} average={average} />
    </div>
  )
}

export default App
