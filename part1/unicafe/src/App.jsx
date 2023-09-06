const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Content = (props) => {
  const content = props.parts.map(part => part.name + ' ' + part.exercises)

  return (
    <>
      <p>{content[0]}</p>
      <p>{content[1]}</p>
      <p>{content[2]}</p>
    </>
  )
      
}
const Total = (props) => {
  // observation: adding curly braces to the lambda function body also requires us to add the return keyword
  const total = props.exercises.reduce((acc, next) => acc + next, 0)

  return (
    <p>Number of exercises {total}</p>
  )
}
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

  const exercises = parts.map(part => part.exercises);

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total exercises={exercises} />
    </div>
  )
}

export default App
