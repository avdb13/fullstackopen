interface CoursePart {
  name: string;
  exerciseCount: number;
}

const Header = ({ courseName }: { courseName: string }) => (
  <h1>{courseName}</h1>
)

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => (
  <ul>
    {courseParts.map(part => <li key={part.name}>{part.name} {part.exerciseCount}</li>)}
  </ul>
)

const Total = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return (
    <p>
      Number of exercises{" "}
      {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </p>
  )
}

const App = () => {
  const courseName: string = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14
    }
  ];

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default App;
