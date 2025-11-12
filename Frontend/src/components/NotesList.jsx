import { useEffect, useState } from "react";
import "../global.css";

export default function NotesList({ user, onSelectNote }) {
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/notes?user_id=${user.user_id}`);
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Error al cargar notas:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://127.0.0.1:5000/api/notes/${id}`, { method: "DELETE" });
      fetchNotes();
    } catch (err) {
      console.error("Error al eliminar nota:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div style={{ flex: 1 }}>
      {notes.length === 0 && <p>No hay apuntes todavía.</p>}
      <ul>
        {notes.map((note) => (
          <li key={note.id} style={{ marginBottom: "0.75rem" }}>
            <strong>{note.title}</strong>
            <button onClick={() => onSelectNote(note)} title="Editar nota">✏️</button>
            <button onClick={() => handleDelete(note.id)} title="Eliminar nota">🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
