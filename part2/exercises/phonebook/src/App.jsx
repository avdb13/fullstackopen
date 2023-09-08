import { useState, useEffect } from 'react'
import axios from 'axios'


const Filter = ({ handleFilter }) => <div>filter shown with <input onChange={handleFilter} /></div>

const PersonForm = ({ name, number, handleName, handleNumber, addPerson }) => {
    return (
      <form onSubmit={addPerson}>
        <div>
          name: <input value={name} onChange={handleName} />
        </div>
        <div>
          number: <input value={number} onChange={handleNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

const Persons = ({ persons }) => {
  return (
    <ul>
      {persons.map(person =>
        <Person name={person.name} number={person.number} key={person.id} />
      )}
    </ul>
  )
}

const Person = ({ name, number }) => <li>{name} {number}</li>

const App = () => {
  const [persons, setPersons] = useState([])
    
  useEffect(() => {
    axios
    .get('http://localhost:3000/persons')
    .then((response) => setPersons(response.data))
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  const handleName = (event) => setNewName(event.target.value)
  const handleNumber = (event) => setNewNumber(event.target.value)
  const handleFilter = (event) => setNewFilter(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.find(person => person.name == newName)) {
      alert(`${newName} is already added to the phonebook`)
    } else {
      setPersons([...persons, { name: newName, number: newNumber, id: persons.length+1}])
    }
    
    // note: for ergonomics we also remove the name when it's a duplicate
    setNewName('')
    setNewNumber('')
  }

  const filtered = newFilter ? persons.filter(person =>
    person.name.toLowerCase().startsWith(newFilter.toLowerCase())
  ) : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleFilter={handleFilter} />
      <h2>Add new contact</h2>
      <PersonForm
        name={newName}
        number={newNumber}
        handleName={handleName}
        handleNumber={handleNumber}
        addPerson={addPerson}
      />
      <h2>Contacts</h2>
      <Persons persons={filtered} />
    </div>
  )
}

export default App