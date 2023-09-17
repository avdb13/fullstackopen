import { useState, useEffect } from "react";
import Note from "./components/Note";
import noteService from "./services/notes";
import loginService from "./services/login";
import "./app.css";

const FilterButton = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};

const Footer = () => {
  const footerStyle = {
    color: "green",
    fontStyle: "italic",
    fontSize: 16,
  };

  return (
    <div style={footerStyle}>
      <br />
      <em>
        Note app, department of bad engineering, university of dummies 2023
      </em>
    </div>
  );
};

const App = () => {
  const { getAll, update, create } = noteService;

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("a new note ...");
  const [showAll, setShowAll] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getAll().then((notes) => setNotes(notes));
  }, [getAll]);

  useEffect(() => {
    const userJson = window.localStorage.getItem("NoteAppUser");
    if (userJson) {
      const user = JSON.parse(userJson)

      setUser(user)
      noteService.setToken(user.token)
    }
  }, [user]);

  const toggleImportance = (id) => {
    // note: indexing into the array directly is more idiomatic than comparing IDs
    const note = notes.find((note) => note.id === id);
    const changed = { ...note, important: !note.important };

    update(changed, id)
      .then((updated) =>
        setNotes(notes.map((n) => (n.id === id ? updated : n))),
      )
      .catch((error) => {
        setErrorMessage(
          `the note '${note.content}' was already deleted from the server`,
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  const addNote = (event) => {
    event.preventDefault();

    const note = {
      important: Math.random() < 0.5,
      content: newNote,
    };

    create(note)
      .then((note) => setNotes([...notes, note]))
      .catch((error) => {
        setErrorMessage(error.response.data);

        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });

    setNewNote("");
  };

  const handleNoteChange = (event) => setNewNote(event.target.value);
  const handleClick = () => setShowAll(!showAll);
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
     const user = await loginService.login({ username, password });

      noteService.setToken(user.token)
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (e) {
      setErrorMessage("wrong credentials");

      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const notesForm = () => {
    return (
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    );
  }

  const LoginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <div>
          username{" "}
          <input
            type="text"
            value={username}
            name="Username"
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div>
          password{" "}
          <input
            type="text"
            value={password}
            name="Password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    );
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {user &&
          <p>{user.name} logged in <button onClick={() => window.localStorage.removeItem("NoteAppUser")}>Logout</button></p>
      }
      {user ? notesForm() : LoginForm()}
      <ul>
        {notesToShow.map((note) => {
          return (
            <Note
              toggleImportance={() => toggleImportance(note.id)}
              note={note}
              key={note.id}
            />
          );
        })}
      </ul>

      <FilterButton
        handleClick={handleClick}
        text={showAll ? "show only important" : "show all"}
      />
      <Footer />
    </div>
  );
};

export default App;
