import { useState, useEffect } from "react";
import Note from "./components/Note";
import Service from "./services/notes";
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
  const { getAll, update, create } = Service;

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("a new note ...");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    getAll().then((notes) => setNotes(notes));
  }, []);

  const addNote = (event) => {
    event.preventDefault();

    const note = {
      important: Math.random() < 0.5,
      content: newNote,
    };

    create(note)
      .then((note) => setNotes([...notes, note]))
      .catch((error) => {
        setErrorMessage(error.response.data['error']);

        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });

    setNewNote("");
  };

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

  const handleNoteChange = (event) => setNewNote(event.target.value);

  const handleClick = () => setShowAll(!showAll);

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
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

      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>

      <FilterButton
        handleClick={handleClick}
        text={showAll ? "show only important" : "show all"}
      />
      <Footer />
    </div>
  );
};

export default App;
