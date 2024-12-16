import { Card, Button } from 'react-bootstrap';
import { Note as NoteModel } from '../models/note';

interface NoteProps {
  note: NoteModel;
}

function Note({ note }: NoteProps) {
  const { title, text, createdAt, updatedAt } = note;

  // Helper function to format date
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
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
        <h5 style={{ margin: 0 }}>{title}</h5>
      </Card.Header>
      <Card.Body>
        <Card.Text style={{ fontSize: '0.9rem', color: '#555' }}>{text}</Card.Text>
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
        <Button variant="primary" size="sm">
          Edit
        </Button>
        <Button variant="danger" size="sm">
          Delete
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default Note;
