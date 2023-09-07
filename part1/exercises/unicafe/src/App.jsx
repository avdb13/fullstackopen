import { useState } from 'react'

const Header = ({ title }) => <h1>{title}</h1>

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const Statistics = ({ texts, feedbacks }) => {
  const zipped = feedbacks.map((feedback, i) => [feedback, texts[i]])
  const mapped = zipped.map(content => <p>{content[0]} {content[1]}</p>)

  return <div>{mapped}</div>
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
     <Header title='give feedback' />
     <Button handleClick={() => setGood(good+1)} text='good' />
     <Button handleClick={() => setNeutral(neutral+1)} text='neutral' />
     <Button handleClick={() => setBad(bad+1)} text='bad' />

     <Header title='statistics' />
     <Statistics texts={['good', 'neutral', 'bad']} feedbacks={[good, neutral, bad]} />
    </div>
  )
}

export default App
