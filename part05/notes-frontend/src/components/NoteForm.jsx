import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const addNote = (event) => {
    event.preventDefault()

    createNote({
      important: true,
      content: newNote,
    })


    setNewNote('')
  }
  return (
    <div className='formDiv'>
      <h2>Create new note</h2>
      <form onSubmit={addNote}>
        <input placeholder='a new note ...' value={newNote} onChange={(event) => setNewNote(event.target.value)} />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm
