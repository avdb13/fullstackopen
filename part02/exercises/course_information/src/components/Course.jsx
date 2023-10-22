const Course = ({ course }) => {
    return (
        <li>
            <Header title={course.name} />
            <Content parts={course.parts} />
            <TotalExercises parts={course.parts} />
        </li>
    )
}

const Header = ({ title }) => <h2>{title}</h2>

const Content = ({ parts }) => {
    return (
        <ul>
            {parts.map(part =>
                <Part title={part.name} exercises={part.exercises} key={part.id} />
            )}
        </ul>
    )
}

const Part = ({ title, exercises }) => <li>{title} {exercises}</li>

const TotalExercises = ({ parts }) => {
    const exercises = parts.map(part => part.exercises)
    const total = exercises.reduce((acc, next) => acc += next)

    return <p>total of {total} exercises</p>
}

export default Course