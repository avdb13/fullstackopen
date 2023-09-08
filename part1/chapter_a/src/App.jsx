const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  const contents = parts.map(part => part.name + ' ' + part.exercises)
  const total = parts.map(part => part.exercises).reduce((acc, next) => acc + next, 0);

  return (
    <div>
      <h1>{course}</h1>
      <p>{contents[0]}</p>
      <p>{contents[1]}</p>
      <p>{contents[2]}</p>
      <p>Number of exercises {total}</p>
    </div>
  )
}

export default App
