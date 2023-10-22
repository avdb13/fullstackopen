const Persons = ({ persons, handleRemove }) => {
  return (
    <ul>
      {persons.map(person => <Person person={person} handleRemove={handleRemove} key={person.id} />)}
    </ul>
  )
}

const Person = ({ person, handleRemove }) => (
  <li>
    {person.name} {person.number} 
    <button onClick={() => handleRemove(person.id)}>remove</button>
  </li>
)

export default Persons