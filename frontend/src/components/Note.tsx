import { Card, Button } from 'react-bootstrap';
import type { Note as NoteModel } from '../models/note'; // Type-only import
import { FaEdit, FaTrash } from 'react-icons/fa';

interface NoteProps {
  note: NoteModel;
  onDeleteNoteClicked: (note: NoteModel) => void;
  onEditNoteClicked?: (note: NoteModel) => void;
}

const Note: React.FC<NoteProps> = ({ note, onDeleteNoteClicked, onEditNoteClicked }) => {
  const { title, text, createdAt, updatedAt } = note;

  // Format date helper
  const formatDate = (date: string) =>
    new Date(date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

  // Delete handler
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    onDeleteNoteClicked(note);
    e.stopPropagation(); // Prevent event bubbling to parent elements
  };

  return (
    <Card
      style={{
        width: '20rem',
        margin: '1rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    >
      <Card.Header style={{ backgroundColor: '#007BFF', color: '#fff' }}>
        <h5 style={{ margin: 0 }}>{title || 'Untitled Note'}</h5>
      </Card.Header>
      <Card.Body>
        <Card.Text style={{ fontSize: '0.9rem', color: '#555' }}>
          {text || 'No content available'}
        </Card.Text>
        <hr />
        <Card.Text>
          <small>
            <strong>Created:</strong> {formatDate(createdAt)}
          </small>
        </Card.Text>
        <Card.Text>
          <small>
            <strong>Updated:</strong> {formatDate(updatedAt)}
          </small>
        </Card.Text>
      </Card.Body>
      <Card.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Edit button with optional callback */}
        <Button
          variant="warning"
          onClick={() => onEditNoteClicked && onEditNoteClicked(note)}
          title="Edit this note"
        >
          <FaEdit /> Edit
        </Button>
        {/* Delete button */}
        <Button variant="danger" onClick={handleDelete} title="Delete this note">
          <FaTrash /> Delete
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default Note;
