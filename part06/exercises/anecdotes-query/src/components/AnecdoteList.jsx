import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from '../requests'
import { useNotificationDispatch } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.map((anecdote) =>
          anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote,
        ),
      )
    },
  })

  const dispatch = useNotificationDispatch()

  const handleVote = (anecdote) => {
    dispatch({ type: 'NEW', payload: `anecdote '${anecdote.content}' voted` })
    newAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    setTimeout(() => dispatch({ type: 'RESET' }), 5000)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
  })

  if (result.isError) {
    return <div>anecdote service is not available due to problems on the server</div>
  }

  if (result.isLoading) {
    return <div>loading data ...</div>
  }

  const anecdotes = result.data

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has{' '}{anecdote.votes}{' '}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
