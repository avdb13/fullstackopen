import { useState } from "react";

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState("a new note ...");

  const addNote = (event) => {
    event.preventDefault();

    createNote({
      important: Math.random() < 0.5,
      content: newNote,
    })


    setNewNote("");
  };
  return (
    <div>
      <h2>Create new note</h2>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={(event) => setNewNote(event.target.value)} />
        <button type="submit">save</button>
      </form>
    </div>
  )
};

export default NoteForm
