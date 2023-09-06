const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Content = (props) => {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  )
      
}
const Total = (props) => {
  // observation: `(acc, next) => { acc + next }` and `function(acc, next) { acc + next }`
  // don't behave like expected here
  const total = props.exercises.reduce((acc, next) => acc + next, 0)

  return (
    <p>Number of exercises {total}</p>
  )
}
const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  const exercises = [part1, part2, part3].map(part => part.exercises);

  return (
    <div>
      <Header course={course} />
      <Content part={part1} />
      <Content part={part2} />
      <Content part={part3} />
      <Total exercises={exercises} />
    </div>
  )
}

export default App
