import { useState, useEffect } from 'react'
import axios from 'axios'
import service from './components/numbers'

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

const App = () => {
  const [persons, setPersons] = useState([])
    
  useEffect(() => {
    service
      .getAll()
      .then((persons) => setPersons(persons))
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  const handleName = (event) => setNewName(event.target.value)
  const handleNumber = (event) => setNewNumber(event.target.value)
  const handleFilter = (event) => setNewFilter(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()

    const newPerson = { name: newName, number: newNumber }
    const duplicatePerson = persons.find(person => person.name === newName)
    const window = confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)

    if (duplicatePerson) {
      if (window) {
        service.update(newPerson, duplicatePerson.id).then(response => {
          setPersons(persons.map(person => person.id === duplicatePerson.id ? response : person))
        })
      }
    } else {
      service.create(newPerson).then(person => setPersons([...persons, person]))
    }

    setNewName('')
    setNewNumber('')
  }

  const removePerson = (id) => {
    // note: 'dangerous' since find returns undefined instead of false on failure
    const oldPerson = persons.find(person => person.id === id)

    if (oldPerson) {
      if (confirm(`Delete ${oldPerson.name}?`)) {
        service.remove(id).then(() => setPersons(persons.filter(person => person.id !== oldPerson.id)))
      }  
    } else {
      alert(`person with ID ${id} is already deleted`)
    }
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
      <Persons persons={filtered} handleRemove={removePerson}/>
    </div>
  )
}

export default App