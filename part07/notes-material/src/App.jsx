import { Alert, AppBar, Toolbar, Button, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField } from '@mui/material'
import { useState } from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
  useNavigate,
  useMatch,
} from "react-router-dom"
import { styled } from 'styled-components'

const MyButton = styled.button`
  background: Bisque;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
`
const MyInput = styled.input`
  margin: 0.25em;
`

const MyPage = styled.div`
  padding: 1em;
  background: papayawhip;
`

const MyNavigation = styled.div`
  background: BurlyWood;
  padding: 1em;
`

const MyFooter = styled.div`
  background: Chocolate;
  padding: 1em;
  margin-top: 1em;
`

const Home = () => (
  <div>
    <h2>TKTL notes app</h2>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
  </div>
)

const Note = ({ note }) => {
  return (
    <div>
      <h2>{note.content}</h2>
      <div>{note.user}</div>
      <div><strong>{note.important ? 'important' : ''}</strong></div>
    </div>
  )
}

const Notes = ({ notes }) => (
  <div>
    <h2>Notes</h2>
    <TableContainer component={Paper}>
      <Table>
      <TableBody>
      {notes.map(note =>
        <TableRow key={note.id}>
          <TableCell>
            <Link to={`/notes/${note.id}`}>{note.content}</Link>
          </TableCell>
          <TableCell>
            {note.user}
          </TableCell>
        </TableRow>
      )}
      </TableBody>
      </Table>
    </TableContainer>
  </div>
)

const Users = () => (
  <div>
    <h2>TKTL notes app</h2>
    <ul>
      <li>Matti Luukkainen</li>
      <li>Juha Tauriainen</li>
      <li>Arto Hellas</li>
    </ul>
  </div>
)

const Login = (props) => {
  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()
    props.onLogin('mluukkai')
    navigate('/')
  }

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={onSubmit}>
        <div>
          username: <MyInput />
        </div>
        <div>
          password: <MyInput type='password' />
        </div>
        <MyButton primary='' type="submit">login</MyButton>
      </form>
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      content: 'HTML is easy',
      important: true,
      user: 'Matti Luukkainen'
    },
    {
      id: 2,
      content: 'Browser can execute only JavaScript',
      important: false,
      user: 'Matti Luukkainen'
    },
    {
      id: 3,
      content: 'Most important methods of HTTP-protocol are GET and POST',
      important: true,
      user: 'Arto Hellas'
    }
  ])

  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const login = (user) => {
    setUser(user)
    setMessage(`welcome ${user}`)
    setTimeout(() => setMessage(null), 3000)
  }

  const padding = {
    padding: 5
  }

  const margin = {
    marginBottom: 20
  }

  const match = useMatch('/notes/:id')
  const note = match ? notes.find(note => note.id === Number(match.params.id)) : null

  return (
    <MyPage>
    <div className='container'>
      {(message && <Alert severity="success">{message}</Alert>)}
      <MyNavigation>
        <Toolbar>
          <IconButton edge='start' color='black' aria-label='menu'>
          </IconButton>
          <Button component={Link} to="/" color='inherit'>
            home
          </Button>
          <Button component={Link} to="/notes" color='inherit'>
            notes
          </Button>
          <Button component={Link} to="/users" color='inherit'>
            users
          </Button>
            {user
              ? <em>{user} logged in</em>
              : <Button component={Link} to="/login" color='inherit'>login</Button>
            }
        </Toolbar>
      </MyNavigation>

      <Routes>
        <Route path="/notes/:id" element={<Note note={note} />} />
        <Route path="/notes" element={<Notes notes={notes} />} />
        <Route path="/users" element={<Users />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <MyFooter>
        <em>Note app, Department of Computer Science 2023</em>
      </MyFooter>
    </div>
    </MyPage>
  )
}

export default App