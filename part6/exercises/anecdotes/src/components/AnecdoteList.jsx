import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { newNotification } from '../reducers/notificationReducer'

const Anecdotes = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) =>
    anecdotes.filter((anecdote) =>
      anecdote.content.toLowerCase().startsWith(filter),
    ),
  )

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
  const handleClick = () => {
    dispatch(addVote(anecdote.id))
    dispatch(newNotification(`you voted '${anecdote.content}'`))
    setTimeout(() => dispatch(newNotification('')), 5000)
  }

  return (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes} <button onClick={handleClick}>votes</button>
      </div>
    </div>
  )
}

export default Anecdotes
