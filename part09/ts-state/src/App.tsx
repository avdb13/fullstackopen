import axios from 'axios';
import { useEffect, useState } from 'react'
import { getAllNotes, createNote } from './services/noteService';
import { Note } from './types';

function App() {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<Note[]>([{ id: 1, content: 'testing' }]);

  useEffect(() => {
    getAllNotes().then(notes => setNotes(notes))
  }, [])

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault()

    createNote({ content: note }).then(newNote => setNotes([...notes, newNote]))

    setNote('')
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={note} onChange={({ target }) => setNote(target.value)} />
        <button type='submit'>add</button>
      </form>
      <ul>
        {notes.map(note => <li key={note.id}>{note.content}</li>)}
      </ul>
    </div>
  )
}

export default App
