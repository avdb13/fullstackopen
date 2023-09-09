import { useState } from 'react'
import Note from './components/Note'

// note: we have to use props here to avoid a naming conflict
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('a new note ...')
  const [showAll, setShowAll] = useState(true)

  const addNote = (event) => {
    event.preventDefault()
      const note = {
        important: Math.random() < 0.5,
        content: newNote,
        id: notes.length+1,
      }

      setNotes([...notes, note])
      setNewNote('')
  }

  const handleNoteChange = (event) => setNewNote(event.target.value)

  const handleClick = () => setShowAll(!showAll)

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <ul>
          {notesToShow.map(note => <Note note={note} key={note.id} />)}
      </ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type='submit'>save</button>
      </form>
      
      <FilterButton handleClick={handleClick} text={showAll ? 'show only important' : 'show all'} />
    </div>
  )
}

const FilterButton = ({ handleClick, text }) => {
    return <button onClick={handleClick}>{text}</button>
}

export default App
