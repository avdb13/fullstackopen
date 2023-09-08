import { useState } from 'react'

const Header = ({ title }) => <h2>{title}</h2>

const Search = ({ handleFilter }) => <div>filter shown with <input onChange={handleFilter} /></div>

const CreateContact = ({ name, number, handleName, handleNumber, addPerson }) => {
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

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
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
      <Header text='Phonebook' />
      <Search handleFilter={handleFilter} />

      <Header text='Add new contact' />
      <CreateContact
        name={newName}
        number={newNumber}
        handleName={handleName}
        handleNumber={handleNumber}
        addPerson={addPerson}
      />

      <Header text='Numbers' />
      <ul>
        {filtered.map(person => <li key={person.id}>{person.name} {person.number}</li>)}
      </ul>
    </div>
  )
}

export default App