const App = ({ store }) => {
  const dispatch = (type) => {
    store.dispatch({ type })
  }

  return (
    <div>
      <button onClick={() => dispatch('GOOD')}>good</button>
      <button onClick={() => dispatch('OK')}>ok</button>
      <button onClick={() => dispatch('BAD')}>bad</button>
      <button onClick={() => dispatch('ZERO')}>reset stats</button>
      <div>good {store.getState().good}</div>
      <div>ok {store.getState().ok}</div>
      <div>bad {store.getState().bad}</div>
    </div>
  )
}

export default App
