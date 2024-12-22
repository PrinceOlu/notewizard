import { Note } from "../models/note";

// Helper function to handle fetching data and error handling
async function fetchData(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  if (response.ok) {
    return response;
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.error || 'An unknown error occurred';
    throw new Error(errorMessage);
  }
}

// Fetch all notes from the API
export async function fetchNotes(): Promise<Note[]> {
  const response = await fetchData("http://localhost:5000/api/notes", {
    method: "GET",
  });
  return response.json();
}

export interface NoteInput {
  title: string;
  text: string;
}

// Create a new note
export async function createNote(note: NoteInput): Promise<Note> {
  const response = await fetchData("http://localhost:5000/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note), // Send the note data in the body
  });
  return response.json(); // Return the created note
}


// delete a note
export async function deleteNote(noteId: string): Promise<void> {
  try {
    const response = await fetchData(`http://localhost:5000/api/notes/${noteId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete note with ID ${noteId}: ${response.statusText}`);
    }

    console.log(`Note with ID ${noteId} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting note with ID ${noteId}:`, error);
    throw error; // Re-throw the error for further handling in the calling code
  }
}

// update note api
export async function updateNote(noteId: string, note: NoteInput): Promise<Note> {
  try {
    const response = await fetchData(`http://localhost:5000/api/notes/${noteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note), // Send the note data in the body
    });

    if (!response.ok) {
      // Throwing a more detailed error with response text for easier debugging
      const errorText = await response.text();
      throw new Error(`Failed to update note with ID ${noteId}: ${response.statusText} - ${errorText}`);
    }

    // Parse and return the updated note data if successful
    const updatedNote: Note = await response.json(); // Assuming the server returns the updated note
    console.log(`Note with ID ${noteId} updated successfully.`);
    return updatedNote;

  } catch (error) {
    console.error(`Error updating note with ID ${noteId}:`, error);
    throw error; // Re-throw the error for further handling in the calling code
  }
}
