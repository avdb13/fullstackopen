import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const handleInput = (event) => setNewName(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.find(person => person.name == newName)) {
      alert(`${newName} is already added to the phonebook`)
    } else {
      setPersons([...persons, { name: newName }])
    }
    
    // note: for ergonomics we also remove the name when it's a duplicate
    setNewName('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleInput} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map(person => <li key={person.name}>{person.name}</li>)}
      </ul>
    </div>
  )
}

export default App