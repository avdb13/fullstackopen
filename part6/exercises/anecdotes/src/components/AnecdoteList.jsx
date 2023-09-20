import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'

const Anecdotes = () => {
  const anecdotes = useSelector((state) => state)

  return (
    <ul>
      {anecdotes
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <Anecdote key={anecdote.id} anecdote={anecdote} />
        ))}
    </ul>
  )
}

const Anecdote = ({ anecdote }) => {
  const dispatch = useDispatch()

  return (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}{' '}
        <button onClick={() => dispatch(addVote(anecdote.id))}>votes</button>
      </div>
    </div>
  )
}

export default Anecdotes
