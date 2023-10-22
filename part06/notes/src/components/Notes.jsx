import { useDispatch, useSelector } from 'react-redux'
import { toggleImportanceOf } from '../reducers/noteReducer'
import noteService from '../services/notes'

const Note = ({ note, handleClick }) => {
  return (
    <li onClick={handleClick}>
      {note.content} <strong>{note.important ? 'important' : ''}</strong>
    </li>
  )
}

const Notes = () => {
  const dispatch = useDispatch()

  const notes = useSelector(({ filter, notes }) => {
    switch (filter) {
    case 'IMPORTANT': return notes.filter(n => n.important)
    case 'UNIMPORTANT': return notes.filter(n => !n.important)
    default: return notes
    }
  })

  const handleClick = async (id) => {
    const newNote = await noteService.update(id)
    dispatch(toggleImportanceOf(newNote.id))
  }

  return (
    <ul>
      {notes.map((note) => (
        <Note
          key={note.id}
          note={note}
          handleClick={() => handleClick(note.id)}
        />
      ))}
    </ul>
  )
}

export default Notes
