import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotificationDispatch } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], [...anecdotes, newAnecdote])
    },
    onError: (e) => {
      dispatch({ type: 'NEW', payload: e.toString() })
      setTimeout(() => dispatch({ type: 'RESET' }), 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    dispatch({ type: 'NEW', payload: `anecdote '${content}' created` })
    newAnecdoteMutation.mutate({ content, votes: 0 })
    setTimeout(() => dispatch({ type: 'RESET' }), 5000)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
