import { useState, useEffect } from 'react'
import axios from 'axios'
import service from './services/numbers'
import PersonForm from './components/form'
import Persons from './components/persons'
import Notification from './components/notification'


const Filter = ({ handleFilter }) => <div>filter shown with <input onChange={handleFilter} /></div>

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
  const [newNotification, setNewNotification] = useState(null)

  const handleName = (event) => setNewName(event.target.value)
  const handleNumber = (event) => setNewNumber(event.target.value)
  const handleFilter = (event) => setNewFilter(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()

    const newPerson = { name: newName, number: newNumber }
    console.log(persons.find(person => person.name === newName))

    const duplicatePerson = persons.find(person => person.name === newName)

    if (duplicatePerson) {
      if (confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        service
          .update(newPerson, duplicatePerson.id)
          .then(response => {
            setPersons(persons.map(person => person.id === duplicatePerson.id ? response : person))
        }).catch(err => {
          setNewNotification({ message: `${newName} has already been removed from the server`, color: 'red' })
        })

        setNewNotification({ message: `${newName} successfully updated`, color: 'green' })
      }
    } else {
      service.create(newPerson).then(person => setPersons([...persons, person]))

      setNewNotification({ message: `${newName} successfully added`, color: 'green' })
    }

    setTimeout(() => setNewNotification(null), 3000)

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
      setNewNotification({ message: `person with ID ${id} is already deleted`, color: 'red' })
      setTimeout(() => setNewNotification(null), 3000)
    }
  }

  const filtered = newFilter ? persons.filter(person =>
    person.name.toLowerCase().startsWith(newFilter.toLowerCase())
  ) : persons

  return (
    <div>
      <Notification notification={newNotification} />
      <br />

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