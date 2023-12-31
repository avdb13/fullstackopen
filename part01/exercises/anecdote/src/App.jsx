import { useState } from 'react'

const Button = ({ text, handleClick }) => <button onClick={handleClick}><p>{text}</p></button>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const rand = () => Math.floor(Math.random() * anecdotes.length)
  const handleVote = (i) => {
    const copy = [...votes]
    copy[i] += 1
    setVotes(copy)  
  }
   
  const [selected, setSelected] = useState(rand())
  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length))

  const mostVotes = votes.reduce((acc, next) => Math.max(acc, next))
  const mostvotesIdx = votes.findIndex(votes => votes === mostVotes)

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <div>
        <Button text='next anecdote' handleClick={() => setSelected(rand)} />
        <Button text='vote' handleClick={() => handleVote(selected)} />
      </div>
      <p>votes: {votes[selected]}</p>

      <h1>Anecdote with most votes</h1>
      {anecdotes[mostvotesIdx]}
    </div>
  )
}


export default App
