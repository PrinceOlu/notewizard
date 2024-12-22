import { useEffect, useState } from 'react';
import './App.css';
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import NoteModal from './components/NoteModal';
import * as NotesApi from './network/notes_api';
import { FaPlus } from 'react-icons/fa';

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);

  useEffect(() => {
    async function loadNotes() {
      try {
        const fetchedNotes = await NotesApi.fetchNotes();
        setNotes(fetchedNotes);
      } catch (error) {
        if (error instanceof Error) {
          setError(`Failed to load notes: ${error.message}`);
        } else {
          setError("An unexpected error occurred.");
        }
      }
    }

    loadNotes();
  }, []);

  const handleShowModal = (note?: NoteModel) => {
    setNoteToEdit(note || null);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const saveNote = (newNote: NoteModel) => {
    try {
      if (noteToEdit) {
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === newNote._id ? newNote : note
          )
        );
      } else {
        setNotes((prevNotes) => [...prevNotes, newNote]);
      }
      handleCloseModal(); // Close modal after saving
    } catch (error) {
      if (error instanceof Error) {
        setError(`Failed to save note: ${error.message}`);
      } else {
        setError("An unexpected error occurred while saving the note.");
      }
    }
  };

  const deleteNote = async (note: NoteModel) => {
    try {
      await NotesApi.deleteNote(note._id);
      setNotes((prevNotes) => prevNotes.filter((n) => n._id !== note._id));
    } catch (error) {
      if (error instanceof Error) {
        setError(`Failed to delete note: ${error.message}`);
      } else {
        setError("An unexpected error occurred while deleting the note.");
      }
    }
  };

  return (
    <div>
      <h2>Notes</h2>

      <button onClick={() => handleShowModal()} className="add-note-btn">
        Add Note <FaPlus />
      </button>

      {showModal && (
        <NoteModal
          noteToEdit={noteToEdit}
          onClose={handleCloseModal}
          onSave={saveNote}
        />
      )}

      {error && <p className="error">{error}</p>}

      <ul className="notes-list">
        {notes.map((note) => (
          <li key={note._id}>
            <Note
              note={note}
              onDeleteNoteClicked={deleteNote}
              onEditNoteClicked={() => handleShowModal(note)} // Correctly triggering modal for edit
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
