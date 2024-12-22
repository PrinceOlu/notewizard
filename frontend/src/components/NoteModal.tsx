import { FaBook } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import * as NotesApi from "../network/notes_api"; // Import your Notes API
import { Note } from "../models/note";
import { useForm, Controller } from "react-hook-form"; // Import the necessary hooks
import { useEffect } from "react";

interface NoteModalProps {
  noteToEdit: Note | null;  // Note can be null if no note is being edited
  onClose: () => void;
  onSave: (newNote: Note) => void; // Callback function to handle new note save
}

interface NoteInput {
  title: string;
  text: string;
}

function NoteModal({ noteToEdit, onClose, onSave }: NoteModalProps) {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<NoteInput>({
    defaultValues: {
      title: noteToEdit?.title || "",
      text: noteToEdit?.text || "",
    }
  });

  // Reset form when noteToEdit changes (for editing a note)
  useEffect(() => {
    if (noteToEdit) {
      reset({
        title: noteToEdit.title,
        text: noteToEdit.text,
      });
    } else {
      reset({
        title: "",
        text: "",
      });
    }
  }, [noteToEdit, reset]);

  // Handle form submission (create or update)
  const onSubmit = async (data: NoteInput) => {
    try {
      const { title, text } = data;
      let newNote: Note;

      if (noteToEdit) {
        // If editing, update the note
        newNote = await NotesApi.updateNote(noteToEdit._id, { title, text });
      } else {
        // If adding, create a new note
        newNote = await NotesApi.createNote({ title, text });
      }

      onSave(newNote);  // Update parent component's state
      onClose();  // Close the modal

    } catch (error) {
      console.error("Failed to save the note", error);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      {/* Modal for Adding/Editing Notes */}
      <Modal show onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {noteToEdit ? "Edit Note" : "Add New Note"} <FaBook style={{ color: "blue", fontSize: "24px" }} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <Form.Control
                    type="text"
                    placeholder="Enter title"
                    isInvalid={!!errors.title}
                    {...field}
                  />
                )}
                rules={{ required: "Title is required" }}
              />
              {errors.title && <p className="error">{errors.title.message}</p>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formText">
              <Form.Label>Note</Form.Label>
              <Controller
                control={control}
                name="text"
                render={({ field }) => (
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter note here"
                    isInvalid={!!errors.text}
                    {...field}
                  />
                )}
                rules={{ required: "Text is required" }}
              />
              {errors.text && <p className="error">{errors.text.message}</p>}
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                {noteToEdit ? "Save Changes" : "Save"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default NoteModal;
