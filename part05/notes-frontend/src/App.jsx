import { useEffect, useState, useRef } from 'react'
import './App.css'
import Note from './components/Note'
import NoteForm from './components/NoteForm'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import FilterButton from './components/FilterButton'
import Togglable from './components/Togglable'
import loginService from './services/login'
import noteService from './services/notes'

const App = () => {
  const { getAll, update, create } = noteService

  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    getAll().then((notes) => setNotes(notes))
  }, [getAll])

  useEffect(() => {
    const userJson = window.localStorage.getItem('NoteAppUser')
    if (userJson) {
      const user = JSON.parse(userJson)

      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const noteFormRef = useRef()

  const toggleImportance = (id) => {
    // note: indexing into the array directly is more idiomatic than comparing IDs
    const note = notes.find((note) => note.id === id)
    const changed = { ...note, important: !note.important }

    update(changed, id)
      .then((updated) =>
        setNotes(notes.map((n) => (n.id === id ? updated : n))),
      )
      .catch(() => {
        setErrorMessage(
          `the note '${note.content}' was already deleted from the server`,
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const createNote = (note) => {
    noteFormRef.current.toggleVisibility()
    create(note)
      .then((note) => setNotes([...notes, note]))
      .catch((error) => {
        setErrorMessage(error.response.data)

        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const handleClick = () => setShowAll(!showAll)
  const newLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)

      setUser(user)
      noteService.setToken(user.token)
      window.localStorage.setItem('NoteAppUser', JSON.stringify(user))
    } catch (e) {
      setErrorMessage('wrong credentials')

      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  const loginForm = () => {
    return (
      <Togglable buttonLabel="login">
        <LoginForm newLogin={newLogin} />
      </Togglable>
    )
  }

  const noteForm = () => {
    return (
      <Togglable ref={noteFormRef} buttonLabel="new note">
        <NoteForm createNote={createNote} />
      </Togglable>
    )
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {user ? (
        <div>
          <p>{user.name} logged in </p>
          {noteForm()}
        </div>
      ) : (
        loginForm()
      )}
      <ul>
        {notesToShow.map((note) => {
          return (
            <Note
              toggleImportance={() => toggleImportance(note.id)}
              note={note}
              key={note.id}
            />
          )
        })}
      </ul>
      <FilterButton
        handleClick={handleClick}
        text={showAll ? 'show only important' : 'show all'}
      />
      <Footer />
    </div>
  )
}

export default App
