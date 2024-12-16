import { useEffect, useState } from 'react';
import './App.css';
import { Note as NoteModel } from './models/note';
import Note from './components/Note'; // Ensure this path is correct
import AddModal from './components/AddModal';

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]); // Updated state name
  const [error, setError] = useState<string | null>(null); // State for error handling

  // Fetch data from the database
  useEffect(() => {
    async function loadNotes() {
      try {
        const response = await fetch("http://localhost:5000/api/notes", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const contentType = response.headers.get("Content-Type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("Expected JSON response but received non-JSON data");
        }
        const notes = await response.json();
        setNotes(notes);
      } catch (error: unknown) {
        // Handle error gracefully
        if (error instanceof Error) {
          setError(`Failed to load notes: ${error.message}`);
        } else {
          setError("An unexpected error occurred.");
        }
      }
    }

    loadNotes();
  }, []);

  return (
    <div>
      <h2>Notes <AddModal /></h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {notes.map((note) => (
          <li key={note._id}>
            <Note note={note} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
